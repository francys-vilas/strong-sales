# Plano de Implementação: Arquitetura Definitiva WhatsApp

## Objetivo

Resolver permanentemente os problemas de conectividade entre o backend Node.js e
a Evolution API, orquestrando ambos em um único stack Docker (`docker-compose`).

## O Problema Atual

Atualmente, os serviços rodam em containers separados/isolados ou tentam usar
`localhost` do host, o que causa falhas intermitentes de "Connection Refused" ou
Timeout devido a firewalls e isolamento de rede do Docker.

## Solução Proposta

1. **Unificação:** Criar um único `docker-compose.yml` contendo os serviços
   `whatsapp-api` (backend) e `evolution-api`.
2. **Rede Interna:** Utilizar uma rede bridge (`whatsapp_network`) para que os
   containers se comuniquem por nome (`http://evolution-api:8080`), sem depender
   do IP do host.
3. **Persistência:** Garantir volumes mapeados para não perder sessões do
   WhatsApp.
4. **Limpeza:** Remover containers antigos e conflitantes antes de subir a nova
   stack.

## Passos da Migração (Script `deploy_v3.bat`)

1. Parar e remover container `whatsapp-api` antigo.
2. Parar e remover container `evolution-api` solto.
3. Subir a nova stack unificada.

## Verificação

1. **Check de Saúde Docker:** `docker ps` deve mostrar 2 containers UP.
2. **Check de Rede Interna:**
   `docker exec whatsapp-manager-api curl -v http://evolution-api:8080`.
3. **Teste Final:** Usuário recarrega a página e conecta o WhatsApp com sucesso.
