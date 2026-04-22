# CP-Loja-Online — Documentação da Estrutura

> **Última atualização:** 2026-04-22 | Refatoração completa da loja online

---

## 🗺️ Mapa de Rotas (HashRouter)

| URL | Componente | Descrição |
|---|---|---|
| `/#/` | `Products.tsx` | **Página principal — Loja Online** |
| `/#/produto/:id` | `ProductDetail.tsx` | Detalhe de produto |
| `/#/cart` | `CartPage.tsx` | Carrinho de compras |
| `/#/login` | `LoginPage.tsx` | Login cliente / admin |
| `/#/register` | `RegisterPage.tsx` | Cadastro de cliente |
| `/#/customer/dashboard` | `CustomerDashboard.tsx` | Área do cliente |
| `/#/admin/dashboard` | `AdminDashboard.tsx` | Painel administrativo |
| `/#/portal` | `LandingPortal.tsx` | Hub de acesso rápido (dev/admin) |
| `/#/produtos` | → redireciona para `/#/` | Legado |
| `/#/inicio` | → redireciona para `/#/` | Legado (tela branca corrigida) |
| `/#/flix` | → redireciona para `/#/` | Removido |
| `/#/*` | → redireciona para `/#/` | Fallback |

> ⚠️ O projeto usa `HashRouter`. A URL sempre terá `#` antes das rotas.

---

## 🏗️ Estrutura da Loja (Products.tsx)

### 1ª Dobra — Hero Section
- Fundo: `bg-[#020617]` (Slate 950)
- **Starfield:** 100 estrelas animadas com efeito `twinkle` aleatório
- Luz pulsante azul `#38b6ff` (canto superior esquerdo)
- Luz pulsante rosa `#E5157A` (canto inferior direito)
- Título com gradiente `from-brand-blue to-brand-pink`
- Badge animado "Tecnologia • NFC • 3D"
- 3 botões de acesso rápido às categorias

### 2ª Dobra — Vitrines por Categoria
Visíveis apenas quando **não há filtro ativo**:

| Bloco | Emoji | Slider Title | Accentcolor |
|---|---|---|---|
| **Impressão 3D** | 🔥 | "Mais Vendidos em Impressão 3D" | `pink` |
| **Tecnologia NFC** | ⚡ | "Inovação com NFC" | `blue` |
| **Sistemas** | 🖥️ | "Soluções Digitais (SaaS)" | `yellow` |

### 3ª Dobra — Barra Sticky de Filtros (top-20)
- Botões de **Categoria**: Todos / Impressão 3D / Tecnologia NFC / Sistemas
- **Subcategorias** (aparecem ao selecionar uma categoria)
- Campo de **Busca** expansível
- Parâmetros via URL: `?cat=Impressão 3D&sub=Chaveiros 3D&q=texto`

### 4ª Dobra — Grid de Produtos
- Grid responsivo: 2 → 3 → 4 → 5 colunas
- Header com total de resultados e botão "Limpar filtros"
- Empty state com botão de reset

---

## 📦 Taxonomia de Produtos

### Impressão 3D
| ID | Produto | Preço | Subcategoria |
|---|---|---|---|
| `p3d-chaveiro-1` | Chaveiro Personalizado 3D | ¥1.500 | Chaveiros 3D |
| `p3d-chaveiro-2` | Chaveiro Inicial 3D | ¥1.200 | Chaveiros 3D |
| `p3d-display-pix` | Display Pix / QR Code 3D | ¥4.500 | Displays / Suportes |
| `p3d-suporte-cel` | Suporte de Celular 3D | ¥2.800 | Displays / Suportes |
| `p3d-letreiro-mesa` | Letreiro de Mesa 3D | ¥6.500 | Letreiros personalizados |
| `p3d-letreiro-parede` | Letreiro de Parede 3D | ¥12.000 | Letreiros personalizados |

### Tecnologia NFC
| ID | Produto | Preço | Subcategoria |
|---|---|---|---|
| `pnfc-chaveiro` | Chaveiro Smart NFC | ¥3.500 | Chaveiros com NFC |
| `pnfc-cartao-black` | Cartão NFC Black Premium | ¥4.500 | Displays com NFC |
| `pnfc-display-portfolio` | Display NFC — Portfólio Interativo | ¥6.500 | Displays com NFC |

### Sistemas / SaaS
| ID | Produto | Preço |
|---|---|---|
| `sys-landing-page` | Landing Page Profissional | ¥9.800 |
| `sys-crm-fidelidade` | Sistema CRM & Fidelidade | ¥15.000 |

---

## 🎨 Paleta de Cores e Animações

```css
--brand-blue:   #38b6ff;  /* Azul NFC */
--brand-pink:   #E5157A;  /* Rosa Gradiente */
--brand-yellow: #FFF200;  /* Amarelo Sistemas */
--brand-gray:   #B3B3B3;  /* Texto secundário */
--bg-main:      #020617;  /* Slate 950 — fundo global */

@keyframes twinkle { 0%,100%{ opacity:0; scale:0.5 } 50%{ opacity:1; scale:1.2 } }
@keyframes fadeInUp { from{ opacity:0; translateY:20px } to{ opacity:1; translateY:0 } }
```

---

## 🚀 Deploy — GitHub Actions

### Caminho correto no servidor Hostinger
```
/home/u176367625/public_html/cp-loja-online/
```

### `.htaccess` — Configuração Crítica
```apache
DirectoryIndex index.html    # Força index.html sobre default.php
```

> **Problema raiz identificado:** O servidor Hostinger tinha `default.php`
> como documento padrão, ignorando o React. O `DirectoryIndex index.html`
> no `.htaccess` resolve isso definitivamente.

### Secrets GitHub Actions
| Secret | Valor |
|---|---|
| `SSH_HOST` | `46.202.186.144` |
| `SSH_USER` | `u176367625` |
| `SSH_PORT` | `65002` |
| `SSH_PASSWORD` | *(senha SSH)* |
| `APP_KEY` | `base64:dKnSP9WM95...` |
| `DB_DATABASE` | `u176367625_cplojaonline` |
| `DB_USERNAME` | `u176367625_cploja` |
| `DB_PASSWORD` | `CPteshima23` |

---

## 🗂️ Arquivos Principais

```
frontend/src/
├── App.tsx                      ← Rotas (HashRouter)
├── components/
│   ├── layout/MainLayout.tsx    ← Navbar com Impressão 3D | NFC | Sistemas
│   └── ui/Starfield.tsx         ← Componente de estrelas animadas
├── features/
│   ├── catalog/pages/
│   │   ├── Products.tsx         ← PÁGINA PRINCIPAL DA LOJA ⭐
│   │   └── components/
│   │       ├── ProductCard.tsx
│   │       └── ProductSlider.tsx (partnerSlug e partnersList opcionais)
│   ├── auth/                    ← Login / Register
│   ├── cart/                    ← Carrinho + Checkout
│   └── admin/                   ← Painel Admin
└── services/mockData.ts         ← Banco de dados em memória

.htaccess                        ← Roteamento Apache (DirectoryIndex fix)
```

---

## ⚠️ Problemas Conhecidos — Histórico e Soluções

| Problema | Causa | Solução Aplicada |
|---|---|---|
| Tela branca em `/#/inicio` | Rota não existia | `Navigate to="/" replace` no App.tsx |
| `default.php` na raiz | Hostinger priorizava `.php` | `DirectoryIndex index.html` no `.htaccess` |
| Alterações não aparecem | Cache do navegador | `Cmd+Shift+R` / `Ctrl+F5` |
| `ProductSlider` crashando | Props obrigatórias sem valor | `partnerSlug?` e `partnersList?` opcionais |
| Build quebrando no Actions | Imports com caminhos errados | App.tsx reescrito com caminhos corretos |
