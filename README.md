# RecoverAI

RecoverAI is a real-time post-operative patient surveillance and early-warning web application. It uses simulated physiological telemetry to demonstrate continuous vital monitoring, risk categorisation, explainable alerts, and near-term risk forecasting in an intuitive clinical dashboard.

---

## 1. Project Overview

During post-operative surgical recovery, subtle physiological fluctuations can indicate oncoming clinical complications before overt crisis occurs. RecoverAI demonstrates how continuous telemetry surveillance, rule-based escalation algorithms, and near-term trend visibility can help care teams monitor patient stability and detect deterioration early.

The application pairs a Node.js/Express simulation engine that pushes live vitals every 1,500 ms via Server-Sent Events (SSE) with a responsive React dashboard built with Tailwind CSS and Recharts.

---

## 2. Problem Statement

In conventional post-surgical floor monitoring:
- **Infrequent Spot Checks:** Manual spot checks every few hours can miss transient desaturations or trending fevers between rounds.
- **Cognitive Overload & Alarm Fatigue:** Clinicians frequently face alert noise without transparent clinical context or clear threshold attribution.
- **Delayed Intervention:** Subtle drifts from individual patient baselines can progress into acute emergencies (e.g., severe hypoxemia or systemic infection) before escalation occurs.

RecoverAI addresses these challenges by simulating continuous physiological streaming, applying transparent multi-tier risk rules, and surfacing actionable trend curves in a focused monitoring workspace.

---

## 3. Key Features

- **Real-Time Physiological Telemetry Streaming:** Live vital updates broadcast every 1,500 ms using Server-Sent Events (SSE).
- **Core Bedside Vital Monitoring:**
  - **Heart Rate (HR):** Monitored in beats per minute (bpm).
  - **Blood Oxygen Saturation (SpO2):** Monitored as a percentage (%).
  - **Body Temperature:** Monitored in degrees Celsius (°C).
- **Three-Tier Risk Categorisation:**
  - **Stable:** Vitals reside within expected recovery targets.
  - **Watch:** Early deviations or baseline drift requiring closer clinical attention.
  - **High Risk:** Acute threshold breach demanding immediate bedside review.
- **Rule-Based Clinical Alerts:** Explainable, transparent thresholds (e.g., SpO2 < 92%, HR > 110 bpm, Temp > 38°C for High Risk) with human-readable clinical rationale.
- **Simulated Post-Op Complications:** Deterministic anomaly injection simulating clinical scenarios:
  - *Tachycardia* (elevated heart rate with moderate desaturation)
  - *Desaturation* (acute drop in oxygen saturation)
  - *Post-Operative Fever* (temperature spike indicating possible infection)
- **Near-Term Risk Forecasting:** Rolling-average risk trajectory projection over 6-hour, 12-hour, and 24-hour windows.
- **Operations Dashboard:** Ward overview showing patient risk distributions, priority watchlist, active alert feed, and dynamic telemetry charts.
- **Patient Roster & Search:** Searchable directory filtering patients by name, ward/room, or surgical procedure.
- **Patient Detail Pages:** Deep-dive historical charts displaying up to 90 recent telemetry readings, baseline metric comparisons, and alert histories.
- **Alert Feed & Triage:** Dedicated alert feed with filterable severity views (All, Critical, Watch) and direct navigation to affected patient records.

---

## 4. How RecoverAI Works

```
+-------------------------------------------------------------------------+
|                              Node.js / Express                          |
|                                                                         |
|  +--------------------+      +--------------------+      +-----------+  |
|  | Simulation Engine  | ---> | Rule-Based Alerts  | ---> | SSE Stream|  |
|  | (1500 ms Tick Loop)|      | & Risk Evaluation  |      | /api/stream| |
|  +--------------------+      +--------------------+      +-----+-----+  |
+----------------------------------------------------------------|--------+
                                                                 |
                                       Server-Sent Events (SSE)  |
                                                                 v
+-------------------------------------------------------------------------+
|                             React Client (Vite)                         |
|                                                                         |
|  +-----------------------+      +------------------------------------+  |
|  | MonitoringContext     | ---> | UI Views & Interactive Visuals     |  |
|  | (EventSource Listener)|      | - Dashboard & Watchlist            |  |
|  +-----------------------+      | - Patient Roster & Search          |  |
|                                 | - Telemetry Charts (Recharts)      |  |
|                                 | - Alert Feed & Triage              |  |
|                                 +------------------------------------+  |
+-------------------------------------------------------------------------+
```

1. **Bootstrap:** When a user opens the application, `MonitoringContext` fetches the initial system state from `/api/bootstrap`.
2. **Streaming:** The client establishes a persistent SSE connection to `/api/stream` using the browser's native `EventSource`.
3. **Simulation Tick:** Every 1,500 ms, the server recalculates vital signs using trigonometric base curves, baseline patient profiles, and scheduled anomaly cycles.
4. **Evaluation:** The server evaluates safety rules against current vitals and broadcasts a synchronized snapshot containing updated vitals and any newly triggered alerts.
5. **Reactivity:** The React frontend updates metrics, animates Recharts telemetry curves, and categorizes status badges without requiring page reloads.

---

## 5. Technology Stack

### Frontend
- **Framework:** React 18 (`react`, `react-dom`)
- **Routing:** React Router DOM v6 (`react-router-dom`)
- **Data Visualisation:** Recharts v2 (`recharts`)
- **Iconography:** Lucide React (`lucide-react`)
- **Styling:** Tailwind CSS v3, PostCSS, Autoprefixer
- **Build Tool:** Vite v5 (`@vitejs/plugin-react`)

### Backend
- **Runtime:** Node.js (native ES Modules)
- **Web Server:** Express v4 (`express`)
- **Middleware:** CORS (`cors`), `express.json()`, `express.static()`
- **Communication Protocol:** Server-Sent Events (`text/event-stream`)

### Tooling & Deployment
- **Orchestration:** Concurrently (`concurrently`) for simultaneous client and server execution in development.
- **Deployment Blueprint:** Render configuration (`render.yaml`) for unified single-service cloud hosting.

---

## 6. Project Architecture

The repository is structured as a full-stack Node.js project:

- **Development Mode:** Vite runs the client on port `5173` with Hot Module Replacement (HMR). A development proxy in `vite.config.js` forwards all `/api/*` requests to the Express server running on port `4000`.
- **Production Mode:** Vite compiles the client into static assets in `dist/`. The Express server serves these static assets directly and handles fallback client-side routing, while concurrently handling REST and SSE requests on a single port (`PORT` environment variable or default `4000`).

### API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health-check endpoint reporting server status and timestamp. |
| `GET` | `/api/bootstrap` | Returns initial snapshot of all patients, recent alerts, and server state. |
| `GET` | `/api/patients/:id` | Returns complete telemetry history and metadata for a specific patient. |
| `GET` | `/api/stream` | Persistent Server-Sent Events (SSE) stream pushing updates every 1,500 ms. |

---

## 7. Project Structure

```
recoverai/
├── render.yaml              # Render web service configuration
├── index.html               # Main HTML entry point
├── package.json             # Scripts and dependencies
├── package-lock.json        # Dependency lockfile
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS theme configuration
├── vite.config.js           # Vite dev server and proxy setup
│
├── server/
│   └── index.js             # Express application, SSE broadcaster, and telemetry simulator
│
└── src/
    ├── main.jsx             # React entry point with bootstrap error boundary
    ├── App.jsx              # Application router and global context provider
    ├── styles.css           # Custom styles, theme gradients, and glass-panel utilities
    │
    ├── components/
    │   ├── AlertsPanel.jsx      # Alert feed card with severity indicators
    │   ├── AppErrorBoundary.jsx # Top-level React error boundary
    │   ├── AppShell.jsx         # Responsive application frame with sidebar and navigation
    │   ├── BrandSidebar.jsx     # Navigation sidebar with branding and demo notes
    │   ├── ForecastPanel.jsx    # Near-term risk forecast card
    │   ├── PageHeader.jsx       # Standardised header with live status and search
    │   ├── PatientCard.jsx      # Patient vitals overview card
    │   ├── StatusPanel.jsx      # Bedside risk assessment and rule breakdown
    │   └── VitalsChart.jsx      # Interactive Recharts line graph for telemetry
    │
    ├── context/
    │   └── MonitoringContext.jsx# Shared state and EventSource SSE lifecycle management
    │
    ├── data/
    │   └── api.js               # REST client functions for initial bootstrap and patient lookup
    │
    ├── lib/
    │   ├── format.js            # Vital status mapping and metric color tone utilities
    │   └── navigation.js        # Navigation item configurations
    │
    └── pages/
        ├── DashboardPage.jsx    # Primary operations dashboard
        ├── PatientsPage.jsx     # Searchable patient directory
        ├── AlertsPage.jsx       # Triage alerts view with category filters
        └── PatientDetailPage.jsx# In-depth telemetry review for an individual patient
```

---

## 8. Installation and Setup

### Prerequisites
- **Node.js:** v18.0.0 or higher recommended
- **npm:** v9.0.0 or higher

### Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/ShalviGupta0121/recovery-ai.git
cd recovery-ai
npm install
```

---

## 9. Running Locally

To run both the Express backend API and the Vite React frontend concurrently in development mode:

```bash
npm run dev
```

- **Frontend Application:** `http://localhost:5173`
- **Backend API & SSE:** `http://localhost:4000`

> **Note:** During local development, visiting `http://localhost:5173` automatically redirects to `/dashboard`.

---

## 10. Production Build

To build the client bundle and start the production web service:

```bash
npm run build
npm run start
```

1. `npm run build` compiles the React application into the `dist/` directory using Vite.
2. `npm run start` launches the Express server, which serves the production build from `dist/` and hosts the API and SSE streams.

---

## 11. Deployment Information

Because the live monitoring feed relies on Server-Sent Events (SSE), RecoverAI is deployed as a single persistent Node.js web service.

### Deploying to Render
This repository includes a `render.yaml` blueprint. To deploy on Render:
1. Connect your repository to Render.
2. Select **New Web Service** (or apply the blueprint from `render.yaml`).
3. Set the following build and start commands:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - **Health Check Path:** `/api/health`

### Deploying to Other Platforms (e.g., Railway, Heroku, VPS)
Configure a standard Node.js web service with:
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start`
- The server automatically listens on the environment-provided `PORT` variable.

---

## 12. Medical Disclaimer

> **IMPORTANT MEDICAL & REGULATORY DISCLAIMER**
> 
> RecoverAI is an educational demonstration and research prototype that uses simulated patient data. It is not a certified medical device, diagnostic system, or substitute for professional medical judgement. It must not be used to make real clinical decisions or guide actual patient treatment.
> 
> All patient profiles, vital signs, surgical procedures, and telemetry values displayed in this application are entirely synthetic and generated for demonstration purposes.
