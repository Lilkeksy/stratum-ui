# Deploying Stratum on Render

Stratum is configured as one Render web service. The production Express process serves both the built React application and the same-origin API, which keeps authentication cookies and API requests on one HTTPS origin.

## Blueprint deployment

1. Push this repository to GitHub.
2. In Render, choose **New > Blueprint** and connect the repository.
3. Render reads `render.yaml` and asks for every environment value marked `sync: false`.
4. The Blueprint currently sets both `APP_PUBLIC_URL` and `APP_ORIGIN` to `https://stratum-vdjt.onrender.com`.
5. If the service URL or custom domain changes, update both values to that exact HTTPS origin without a trailing slash, then deploy again.

Render supplies `PORT` automatically. Do not add `PORT` or `API_PORT` in the Render dashboard.

The build command is:

```text
npm ci --include=dev && npm run build
```

Vite and its React plugin are build-time development dependencies. The explicit `--include=dev` is required when `NODE_ENV=production`; the repository's `.npmrc` applies the same rule for manually configured Render services.

## Required environment variables

| Variable | Render value |
| --- | --- |
| `NODE_ENV` | `production` |
| `APP_PUBLIC_URL` | `https://stratum-vdjt.onrender.com` |
| `APP_ORIGIN` | `https://stratum-vdjt.onrender.com` |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `SUPABASE_SECRET_KEY` | Supabase server secret key |
| `NVIDIA_NIM_API_KEY` | NVIDIA NIM API key |

The remaining model, timeout, prompt, worker, and translation defaults are declared safely in `render.yaml`. If Google translation is enabled later, change `TRANSLATION_PROVIDER` to `google` and add the server-only `GOOGLE_TRANSLATE_API_KEY`.

Never place `SUPABASE_SECRET_KEY`, `NVIDIA_NIM_API_KEY`, or `GOOGLE_TRANSLATE_API_KEY` in a variable beginning with `VITE_`.

## Supabase redirect configuration

In Supabase **Authentication > URL Configuration**:

- Set the Site URL to `https://stratum-vdjt.onrender.com/`.
- Add `https://stratum-vdjt.onrender.com/?auth_action=confirmed`.
- Add `https://stratum-vdjt.onrender.com/?auth_action=recovery`.

Keep localhost redirect entries only for local development.

## Local files

- `.env.local` contains local development secret values and is intentionally ignored by Git.
- `.env.render` is a populated production-format environment file for bulk-copying into Render. It is also ignored by Git and must never be committed.
- `.env.example` is the safe copyable template and contains placeholders only.
- `render.yaml` is the deployment blueprint and contains no credentials.

Do not upload or commit `.env.local`.

## Verification

After deployment:

1. Open `/api/health` and confirm `status` is `ok`.
2. Load the root URL and confirm the React application appears.
3. Create a test account and verify the confirmation link returns to the Render domain.
4. Log out and back in to verify secure production cookies.
5. Upload a small text PDF and wait for the policy status to reach **Ready**.
