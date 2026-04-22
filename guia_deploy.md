# Guia de Deploy - CP-Loja-Online

Este documento contém todas as informações necessárias para configurar e manter o deploy automatizado do projeto **CP Connect**.

## 🚀 URLs do Projeto
- **Produção:** [https://cp-loja-online.creativeprintjp.com](https://cp-loja-online.creativeprintjp.com)
- **Repositório:** `https://github.com/karlateshima2012-create/CP-Loja-Online/`

## 🛠️ Ambiente de Hospedagem (Hostinger)
O projeto está configurado para rodar em um subdomínio na Hostinger via SSH/SCP.

- **Caminho Absoluto no Servidor:** `/home/u176367625/domains/creativeprintjp.com/public_html/cp-loja-online/`
- **Usuário SSH:** `u176367625`
- **Porta SSH:** `65002`

## 🔐 Configuração de Secrets (GitHub)
Para que o deploy funcione, os seguintes **Secrets** devem estar configurados no GitHub (Settings > Secrets and variables > Actions):

| Nome do Secret | Descrição |
| :--- | :--- |
| `SSH_HOST` | IP do servidor (46.202.186.144) |
| `SSH_USER` | Usuário SSH da Hostinger (u176367625) |
| `SSH_PORT` | Porta SSH (65002) |
| `SSH_PASSWORD` | Senha do usuário SSH |
| `APP_KEY` | Chave de criptografia do Laravel (`base64:dKnSP9WM95iKItqM4qiQARPuDz9k0rBE5OZTAQS6e2k=`) |
| `DB_DATABASE` | Nome do banco de dados (u176367625_cplojaonline) |
| `DB_USERNAME` | Usuário do banco de dados (u176367625_cploja) |
| `DB_PASSWORD` | Senha do banco de dados (CPteshima23) |

## 📦 Fluxo de Deploy Automatizado
O deploy é disparado automaticamente sempre que um **push** é feito para a branch `main`.

**O que o script de deploy faz:**
1.  Instala dependências do Frontend (Node 20).
2.  Gera o build de produção (`npm run build`).
3.  Instala dependências do Backend (PHP 8.4 via Composer).
4.  Cria o pacote de deploy unificando Frontend e Backend.
5.  Cria o arquivo `.env` de produção do Backend dinamicamente usando os Secrets.
6.  Envia os arquivos para o servidor via SCP.
7.  Executa as migrações do banco de dados (`php artisan migrate`) via SSH.

## ⚠️ Observações Importantes
- **Caminho do Lockfile:** O GitHub Actions está configurado para procurar o `package-lock.json` em `./frontend/package-lock.json`. Se mudar a estrutura de pastas, atualize o `deploy.yml`.
- **PHP Version:** O servidor deve suportar PHP 8.2 ou superior. O workflow usa PHP 8.4.
- **Permissões:** Se o deploy falhar no passo de SCP, verifique se o acesso SSH ainda está ativo no painel da Hostinger.

---
*Documento gerado em 22/04/2026*
