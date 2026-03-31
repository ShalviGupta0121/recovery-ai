# RecoverAI

RecoverAI is a React + Vite + Tailwind web application for post-operative patient monitoring. It simulates live vitals, raises explainable rule-based alerts, and includes dedicated Dashboard, Patients, Alerts, and Patient Detail pages.

## Local run

```powershell
npm install
npm run dev
```

Open `http://localhost:5173/dashboard`.

## Production build

```powershell
npm run build
npm run start
```

The Express server serves the built frontend from `dist/` and also exposes:

- `GET /api/health`
- `GET /api/bootstrap`
- `GET /api/patients/:id`
- `GET /api/stream`

## Deploy

The app is set up to deploy as a single Node web service because the live monitoring feed depends on the Express SSE server.

### Render

This repo includes `render.yaml`. You can create a new Render web service from the repo and use:

- Build command: `npm install && npm run build`
- Start command: `npm run start`

### Railway

You can deploy the repo as a Node service using the same commands:

- Build command: `npm install && npm run build`
- Start command: `npm run start`
