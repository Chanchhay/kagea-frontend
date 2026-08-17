# Frontend local development

You edit this app on your machine, but it runs behind the **API gateway** and
talks to the **deployed API**. Nothing else needs to be installed — no database,
no Keycloak, no Java backend.

## The one rule

**Open `http://localhost:8090`, never `http://localhost:3000`.**

Port 3000 renders pages and nothing else. Sign-in, sign-out and every `/api/**`
call are owned by the gateway on port 8090. Opening 3000 directly gives you a
"Page not found" the moment you try to log in.

```
Browser  →  localhost:8090   gateway (auth + routing)
                 ├── /oauth2/**, /logout, /bff/session   handled by the gateway
                 ├── /api/**    → the deployed API on Railway
                 └── /**        → your local Next.js on :3000
```

The gateway holds the session cookie and attaches the access token to API calls,
so the browser never sees a token. That is why the frontend has no auth code.

## One-time setup

### 1. Clone both repositories

```bash
git clone https://github.com/Chanchhay/kagea-frontend.git
git clone https://github.com/Chanchhay/kagea-gateway.git
```

### 2. Configure the gateway

```bash
cd kagea-gateway
cp .env.example .env
```

Fill in `.env` — ask the team lead for the client secret:

```properties
KEYCLOAK_ISSUER_URI=https://auth.chanchhay.site/realms/ai-career
KEYCLOAK_BFF_CLIENT_ID=ai-career-bff-local
KEYCLOAK_BFF_CLIENT_SECRET=<ask the team lead>
BACKEND_URI=https://aicareerinterviewapi-production.up.railway.app
FRONTEND_URI=http://localhost:3000
PORT=8090
SESSION_COOKIE_SECURE=false
```

`SESSION_COOKIE_SECURE` must stay `false` locally. A `Secure` cookie is dropped
silently over plain HTTP, and login then appears to do nothing at all.

### 3. Install frontend dependencies

```bash
cd kagea-frontend
npm install
```

The frontend needs **no** `.env` file. It holds no secrets and no API URL — every
request is same-origin through the gateway.

## Daily workflow

Two terminals:

```bash
# terminal 1 — the app you are editing
cd kagea-frontend && npm run dev

# terminal 2 — the gateway
cd kagea-gateway && ./gradlew bootRun
```

Then open **http://localhost:8090**.

Hot reload works normally: the gateway proxies the HMR websocket, so saving a
file refreshes the browser exactly as if you were on port 3000.

### No Java installed?

Run the gateway with Docker instead — same result, nothing to install:

```bash
cd kagea-gateway
docker build -t kagea-gateway .
docker run --rm -p 8090:8090 --env-file .env \
  -e FRONTEND_URI=http://host.docker.internal:3000 \
  --add-host host.docker.internal:host-gateway \
  kagea-gateway
```

## Things worth knowing

**You are using production data.** The deployed API and real user accounts are
live. Anything you create — jobs, applications, uploaded files — is real. Use a
test account rather than someone's real one.

**Log in with the button, not by typing a URL.** "Login" points at
`/oauth2/authorization/keycloak` on the gateway, which starts the OAuth flow.

**File uploads only send on save.** Choosing a file stages it; the bytes go to
storage when you submit the form, so an abandoned edit uploads nothing.

**Session state comes from two places.** `useGetSessionQuery()` answers "am I
signed in?" cheaply from the gateway. `useGetCurrentUserQuery()` returns the full
profile — name, roles, avatar — from the API. Use the first to decide what to
render, the second for user detail.

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| "Page not found" when logging in | You are on port 3000. Use 8090. |
| Login redirects back but you stay signed out | `SESSION_COOKIE_SECURE=true` in a local `.env`. Set it to `false`. |
| `502` / connection refused on every page | The Next.js dev server is not running. Start terminal 1. |
| API calls return `401` | You are signed out. Click Login. |
| `Invalid parameter: redirect_uri` at Keycloak | Gateway is not on port 8090, or `ai-career-bff-local` is missing the localhost redirect URI. |
| Gateway will not start, complains about a placeholder | `.env` is missing or `KEYCLOAK_BFF_CLIENT_SECRET` is blank. |
