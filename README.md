# Forma Calculator · 832402107_calculator_frontend

Yuhe Jiang · FZUID 832402107 · MUID 24125342

A responsive calculator built with Vite and vanilla JavaScript. Expressions are calculated by the separate FastAPI backend; history is stored in the backend database.

## Public links

- [Live calculator](https://832402107-calculator-frontend-67ak.vercel.app)
- [Frontend repository](https://github.com/yuhejiang929-cmd/832402107_calculator_frontend) · [Backend repository](https://github.com/yuhejiang929-cmd/832402107_calculator_backend)
- [Backend API](https://832402107-calculator-backend.vercel.app) · [Swagger](https://832402107-calculator-backend.vercel.app/docs) · [Health](https://832402107-calculator-backend.vercel.app/api/health)

## Features and architecture

Basic arithmetic, precedence, nested parentheses, decimals and unary signs; expression input and keypad; readable errors; persistent history with search, pagination, single deletion and confirmed clear-all. Additional features include keyboard input, copy result, expression reuse, and persistent light/dark preference.

Browser → **Vercel Vite frontend** → HTTPS JSON → **Vercel FastAPI backend** → SQLAlchemy/psycopg → **Neon PostgreSQL**. Frontend code only edits strings and displays the returned result. Blocking the calculation API produces the backend-unavailable message and `—`, never a locally computed answer. Only the theme preference uses localStorage.

## Local setup

Node.js 22.12+ and npm are required; tested with Node 24.19.0. Start the backend on port 8000, then run from this repository:

```bash
npm ci
cp .env.example .env
npm run dev
```

Open http://localhost:5173. For local development set `VITE_API_BASE_URL=http://localhost:8000`. This is a public build-time API address, never a credential. Production uses `VITE_API_BASE_URL=https://832402107-calculator-backend.vercel.app`. Changing it requires rebuilding/redeploying.

```bash
npm test
npm run format:check
npm run build
npm run preview
```

Build output is `dist/`. A production build without an explicit API URL uses same-origin `/api`; only development defaults to localhost. Configure the backend's `FRONTEND_ORIGINS` for the exact browser origin. Preview uses port 4173 by default and needs its own allowed origin for local integration.

## Deployment

The production frontend is on Vercel: Vite preset, build `npm run build`, output `dist`, and the production API URL above. All public requests use HTTPS. `netlify.toml` remains an optional static-host configuration; it is not the deployed service configuration.

## Modules and usage

| File | Responsibility |
|---|---|
| `src/api.js` | Fetch, JSON/204 handling, 12-second timeout and network errors |
| `src/calculator.js` | Text editing, loading state, duplicate prevention and stale-result protection |
| `src/expression.js` | Display operators and sign text transformation |
| `src/history.js` | API history, debounced search, pagination, deletion and clear confirmation |
| `src/keyboard.js` | Keyboard events without interfering with other controls |
| `src/theme.js` | Theme preference |
| `src/styles.css` | Responsive layout, theme tokens and focus styles |

Enter or `=` submits; Escape clears; Backspace edits. `+/−` toggles a number's sign or wraps a compound expression in `-(...)`. Selecting a history row reuses its text. The backend interprets all operators. Input is limited to 200 characters.

## Verification

Final audit: **2 unit tests passed**, Vite build passed, and Prettier check passed. The complete submission includes `scripts/browser_acceptance.mjs`, which passed **32 checks** using an isolated database and ports 8011/5175. It checks actual process restarts, error states, blocked backend requests, clipboard, history and responsive behavior. The separate production audit and final screenshots are supplied in the submission materials.

## Screenshots

![Production desktop](docs/desktop.png)

![Production mobile](docs/mobile.png)

## Limits and troubleshooting

History is shared by all visitors; there are no accounts or per-user permissions. Clear-all affects the shared backend. Clipboard requires a secure browser context and browser permission. If requests fail, check the API health URL, exact CORS origin and build-time API URL. No frontend calculation fallback exists. System fonts avoid external font dependencies.

Code conventions: [codestyle.md](codestyle.md).
