# Arquitetura Definitiva WhatsApp & Evolution API

## 🎯 Objetivo

Resolver permanentemente a instabilidade de conexão entre o backend Node.js e a
Evolution API, eliminando dependências de rede externa, firewalls de host e
conflitos de porta.

## ⚠️ Problema Atual (Diagnóstico Completo)

1. **Fragmentação:** Os serviços rodam em containers separados, sem conhecer a
   rede um do outro.
2. **Conflito de Rede:** O backend tenta acessar `localhost:8080`, mas dentro do
   container, `localhost` é ele mesmo, não o hospedeiro. Usar `host` networking
   é um "workaround" instável.
3. **Persistência:** Instâncias da Evolution API podem se perder se o container
   for recriado incorretamente.

## 🛠️ Solução Proposta: Stack Unificado

Implementaremos um **Único `docker-compose.yml`** que orquestra ambos os
serviços.

### Componentes da Stack

1. **evolution-api:**
   - Imagem oficial `atendai/evolution-api:latest`.
   - Exposta na porta `8080` (para acesso externo opcional).
   - Rede Interna: `whatsapp_network`.
   - Volumes Persistentes: `evolution_instances`, `evolution_store`.

2. **whatsapp-manager (Nosso Backend):**
   - Build local do Node.js.
   - Exposta na porta `3000`.
   - Conecta na API via nome de serviço: `http://evolution-api:8080` (Garantido
     pelo DNS do Docker).
   - Dependência explícita: `depends_on: evolution-api`.

## 📝 Plano de Migração (Passo a Passo)

### 1. Preparação (Local)

- [x] Criar `docker-compose.yml` unificado.
- [ ] Validar configurações de ambiente (`.env`).

### 2. Limpeza Radical (Servidor)

- Parar TODOS os containers relacionados (`whatsapp-api`, `evolution-api`).
- Remover redes antigas órfãs.
- Garantir porta 3000 e 8080 livres.

### 3. Deploy (Servidor)

- Enviar novos arquivos (`mock` do projeto backend completo).
- Executar `docker-compose up -d --build`.

## ✅ Plano de Verificação (Quality Assurance)

Antes de liberar para uso, executaremos testes **dentro do servidor**:

1. **Teste de Saúde de Container:** Verificar se ambos estão `Up`.
2. **Teste de Rede Interna (Prova Real):**
   - Entrar no container do NodeJS: `docker exec -it whatsapp-manager-api sh`
   - Tentar pingar a API:
     `wget -qO- http://evolution-api:8080/instance/fetchInstances`
   - **Sucesso:** Se retornar JSON (mesmo que vazio), a conexão é sólida.
   - **Falha:** Se der timeout, abortar e corrigir rede.
3. **Teste End-to-End:** Conectar pelo Frontend.
