import { supabase } from './supabase';
import { authService } from './authService';

const API_URL = "https://evolution.clickzap.space";
const API_KEY = "429683C4C977415CAAFCCE10F7D57E11";

/**
 * Service to handle Evolution API interactions with logging to Supabase.
 */
export const evolutionService = {
  /**
   * Helper to log API calls to Supabase.
   */
  async logApiCall(details) {
    try {
      const user = await authService.getCurrentUser();
      if (!user) return;
      
      const org = await authService.getUserOrganization();

      const { error } = await supabase
        .from('evolution_api_logs')
        .insert([{
          user_id: user.id,
          organization_id: org ? org.id : null,
          endpoint: details.endpoint,
          method: details.method,
          request_payload: details.requestPayload,
          response_status: details.responseStatus,
          response_payload: details.responsePayload,
          error_message: details.errorMessage,
        }]);
      
      if (error) {
        console.error("Failed to save log to Supabase:", error);
      }
    } catch (e) {
      console.error("Error logging to Supabase:", e);
    }
  },

  /**
   * Sanitize string to generate a safe instance name.
   */
  sanitizeInstanceName(input) {
    if (!input) return "unknown";
    // Works for emails or UUIDs
    return input.replace(/[^a-zA-Z0-9]/g, "_");
  },

  /**
   * Create a new instance or return existing one.
   * Now accepts optional instanceName override (e.g. Org ID)
   */
  async createInstance(email, customInstanceName = null) {
    const instanceName = customInstanceName || this.sanitizeInstanceName(email);
    const endpoint = `/instance/create`;
    const url = `${API_URL}${endpoint}`;
    
    // 1. Get User and Organization
    const user = await authService.getCurrentUser();
    const org = await authService.getUserOrganization();
    
    // 2. Prepare Webhook URL (Edge Function)
    const webhookUrl = "https://drxsvsqjuwdrzaupdcpo.supabase.co/functions/v1/webhook-listener";

    const payload = {
      instanceName: instanceName,
      qrcode: true,
      integration: "WHATSAPP-BAILEYS",
      webhook: {
          url: webhookUrl,
          byEvents: false,
          events: ["CONNECTION_UPDATE", "QRCODE_UPDATED"]
      }
    };

    let responseData = null;
    let status = 0;
    let errorMessage = null;

    try {
      // 3. Register/Upsert Instance in Supabase BEFORE API call
      // We set status to 'connecting' initially
      if (user) {
          await supabase.from('evolution_instances').upsert({
              user_id: user.id,
              organization_id: org ? org.id : null,
              instance_name: instanceName,
              status: 'connecting',
              connection_status: 'initializing'
          }, { onConflict: 'instance_name' });
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": API_KEY
        },
        body: JSON.stringify(payload)
      });

      status = response.status;
      responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || JSON.stringify(responseData));
      }

      return {
        success: true,
        data: responseData,
        instanceName
      };

    } catch (error) {
        errorMessage = error.message;
        
        return {
            success: false,
            error: errorMessage,
            status,
            instanceName,
            isAlreadyExists: status === 403 || (typeof errorMessage === 'string' && errorMessage.includes("already exists"))
        };
    } finally {
        await this.logApiCall({
            endpoint,
            method: "POST",
            requestPayload: payload,
            responseStatus: status,
            responsePayload: responseData,
            errorMessage
        });
    }
  },

  /**
   * Fetch connection state/QR Code for an existing instance.
   */
  async fetchInstanceConnect(instanceName) {
    const endpoint = `/instance/connect/${instanceName}`;
    const url = `${API_URL}${endpoint}`;
    
    try {
        const user = await authService.getCurrentUser();
        const org = await authService.getUserOrganization();

        const response = await fetch(url, {
            method: "GET",
            headers: { "apikey": API_KEY }
        });

        const status = response.status;
        const responseData = await response.json();
        
        // Sync State to DB
        let currentStatus = 'close';
        let jid = null;
        let picture = null;
        
        if (response.ok) {
            if (responseData.instance) {
                 currentStatus = responseData.instance.state;
                 jid = responseData.instance.ownerJid;
                 picture = responseData.instance.profilePictureUrl;
            } else if (responseData.base64) {
                 currentStatus = 'qrcode'; // Has QR, waiting for scan
            }
        } else {
             if (status === 404) {
                 currentStatus = 'close';
             }
        }
        
        // Upsert/Update the DB record to match reality
        if (user && instanceName) {
            // Update providing Org ID too if missing
             await supabase.from('evolution_instances').upsert({
                 user_id: user.id,
                 organization_id: org ? org.id : null,
                 instance_name: instanceName,
                 status: currentStatus,
                 connection_status: currentStatus,
                 owner_jid: jid,
                 profile_pic_url: picture,
                 updated_at: new Date().toISOString()
             }, { onConflict: 'instance_name' });
        }

        if (!response.ok) {
            throw new Error(responseData.message || "Failed to fetch instance connection");
        }

        return { success: true, data: responseData };

    } catch (error) {
        return { success: false, error: error.message };
    } finally {
        // Disabled logging for simple polling
    }
  },

  /**
   * Get logs from Supabase (API Commands + Webhook Events)
   * Scoped by Organization OR User
   */
  async getLogs() {
      try {
          const user = await authService.getCurrentUser();
          const org = await authService.getUserOrganization();
          
          if (!user) return [];

          // 1. Fetch API Logs
          let query = supabase
              .from('evolution_api_logs')
              .select('*')
              .neq('method', 'GET') // Hide polling
              .order('created_at', { ascending: false })
              .limit(30);
          
          if (org) {
               // If user has org, fetch logs for that org (shared view) OR user's own logs (legacy compatibility)
               query = query.or(`organization_id.eq.${org.id},user_id.eq.${user.id}`);
          } else {
               query = query.eq('user_id', user.id);
          }

          const { data: apiLogs } = await query;

          // 2. Fetch Webhooks (Events we received)
          // We need to know which instance names to look for.
          // Org-based instance name:
          let targetInstanceNames = [];
          
          if (org) {
              const orgInstanceName = this.sanitizeInstanceName(org.id);
              targetInstanceNames.push(orgInstanceName);
          }
           // Add User-based instance name (Legacy/Fallback)
          const userInstanceName = this.sanitizeInstanceName(user.email);
          if (!targetInstanceNames.includes(userInstanceName)) {
              targetInstanceNames.push(userInstanceName);
          }

          let webhookLogs = [];
          if (targetInstanceNames.length > 0) {
              const { data: hooks } = await supabase
                  .from('evolution_webhooks')
                  .select('*')
                  .in('instance_name', targetInstanceNames)
                  .eq('event_type', 'connection.update')
                  .order('created_at', { ascending: false })
                  .limit(30);
              webhookLogs = hooks || [];
          }

          // 3. Format & Merge with VISUAL SIMPLIFICATION
          const formattedApiLogs = (apiLogs || []).map(log => {
              // Only interested in Creation (Start of process) and Deletion
              let eventName = null;
              if (log.endpoint.includes('create') && log.method === 'POST') {
                  eventName = "Aguardando Conexão";
              } else if (log.endpoint.includes('delete') && log.method === 'DELETE') {
                  eventName = "Desconectado (Manual)";
              }

              if (!eventName) return null; // Skip other API calls

              return {
                  id: `api-${log.id}`,
                  event: eventName,
                  status: log.response_status >= 200 && log.response_status < 300 ? "Iniciado" : "Falha",
                  time: new Date(log.created_at).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  }),
                  timestamp: new Date(log.created_at).getTime()
              };
          }).filter(Boolean); // Remove nulls

          const formattedWebhooks = webhookLogs.map(hook => {
              let statusText = hook.payload?.data?.state || hook.payload?.data?.status;
              
              // Map to simple statuses
              let eventName = null;
              let statusLabel = "Info";

              if (statusText === 'open') {
                  eventName = "Conectado";
                  statusLabel = "Sucesso";
              } else if (statusText === 'close') {
                  eventName = "Desconectado";
                  statusLabel = "Aviso";
              }
              
              if (!eventName) return null; // Skip 'connecting', 'qrcode', etc.

              return {
                  id: `hook-${hook.id}`,
                  event: eventName,
                  status: "Sucesso",
                  time: new Date(hook.created_at).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  }),
                  timestamp: new Date(hook.created_at).getTime()
              };
          }).filter(Boolean); // Remove nulls

          const allLogs = [...formattedApiLogs, ...formattedWebhooks]
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, 10); // Show only last 10
              
          return allLogs;

      } catch (error) {
          console.error("Error fetching logs:", error);
          return [];
      }
  },

  /**
   * Logout instance (Disconnects session but keeps instance)
   */
  async logoutInstance(instanceName) {
      if (!instanceName) return { success: false, error: "Nome da instância não fornecido" };
      
      const endpoint = `/instance/logout/${instanceName}`;
      const url = `${API_URL}${endpoint}`;
      
      let responseData = null;
      let status = 0;
      let errorMessage = null;

      try {
          const response = await fetch(url, {
              method: "DELETE", // Evolution API usually uses DELETE for logout
              headers: { "apikey": API_KEY }
          });

          status = response.status;
          responseData = await response.json();

          if (!response.ok && status !== 404 && status !== 400) { // 400/404 might mean already logged out
               throw new Error(responseData.message || "Failed to logout instance");
          }

          // Update Status to close instead of deleting row
          await supabase.from('evolution_instances')
              .update({ status: 'close', connection_status: 'offline', owner_jid: null })
              .eq('instance_name', instanceName);

          return { success: true, data: responseData };

      } catch (error) {
          errorMessage = error.message;
          return { success: false, error: errorMessage };
      } finally {
           await this.logApiCall({
              endpoint, method: "DELETE", requestPayload: null,
              responseStatus: status, responsePayload: responseData, errorMessage
          });
      }
  },

  /**
   * Delete instance (Completely remove)
   */
  async deleteInstance(instanceName) {
      if (!instanceName) return { success: false, error: "Nome da instância não fornecido" };
      
      const endpoint = `/instance/delete/${instanceName}`;
      const url = `${API_URL}${endpoint}`;
      
      let responseData = null;
      let status = 0;
      let errorMessage = null;

      try {
          const response = await fetch(url, {
              method: "DELETE",
              headers: { "apikey": API_KEY }
          });

          status = response.status;
          responseData = await response.json();

          if (!response.ok && status !== 404) {
               throw new Error(responseData.message || "Failed to delete instance");
          }

          await supabase.from('evolution_instances').delete().eq('instance_name', instanceName);

          return { success: true, data: responseData };

      } catch (error) {
          errorMessage = error.message;
          return { success: false, error: errorMessage };
      } finally {
           await this.logApiCall({
              endpoint, method: "DELETE", requestPayload: null,
              responseStatus: status, responsePayload: responseData, errorMessage
          });
      }
  }
};

// Helper
function MapMethodToFriendlyName(method, endpoint) {
    if (endpoint.includes('create')) return "Criar Instância";
    if (endpoint.includes('delete')) return "Excluir Instância";
    if (endpoint.includes('connect')) return "Verificar Conexão";
    return `${method} ${endpoint}`;
}
