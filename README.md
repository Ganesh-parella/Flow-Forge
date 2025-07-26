<h1 align="center">Flow‑Forge ⚡</h1>
<p align="center">
  <b>Automate anything in minutes — a visual, Zapier-like automation builder.</b>
</p>

<p align="center">
  <a href="https://dotnet.microsoft.com/download/dotnet/8.0">
    <img src="https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet&logoColor=white" alt=".NET 8" />
  </a>
  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React 18" />
  </a>
  <a href="https://reactflow.dev/">
    <img src="https://img.shields.io/badge/React%20Flow-latest-000000?logo=react&logoColor=white" alt="React Flow" />
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/TailwindCSS-latest-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  </a>
  <a href="https://clerk.com/">
    <img src="https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&logoColor=white" alt="Clerk" />
  </a>
  <a href="https://www.mysql.com/">
    <img src="https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white" alt="MySQL" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

---

## 🚀 What is Flow‑Forge?

**Flow‑Forge** is a modern, visual automation platform inspired by **Zapier**. It lets users connect services like **Gmail**, **Google Sheets**, and **Webhooks** through an intuitive **drag‑and‑drop** builder. Flows can include **delays**, **conditions**, and multiple actions, powered by a **pluggable .NET execution engine**.

---

## ✨ Core Features

- **Visual Flow Builder** — No-code canvas using **React Flow**.
- **Webhook Triggers** — Kick off flows from any external service.
- **Gmail Action Node** — Send emails securely using Google OAuth2.
- **Google Sheets Node** — Append data to spreadsheets from your flows.
- **Delay Node** — Add wait steps in your workflows.
- **Pluggable Node Architecture** — Add new services without touching the core.
- **Secure & Multi-tenant** — **Clerk**-based auth with proper JWT validation.
- **Execution Logging (Backend)** — Inspect and troubleshoot runs.

---

## 🧱 Architecture (High-level)

Frontend (React + React Flow + Shadcn UI)
|
| JWT (Clerk)
v
Backend (ASP.NET Core 8, REST API)
|
| EF Core + MySQL
v
Database (MySQL)

Google OAuth2 for Gmail & Sheets

Pluggable Flow Engine (Triggers, Actions, Conditions)

yaml
Copy
Edit

---

## 🛠 Tech Stack

| Area        | Tech                                                                 |
|-------------|----------------------------------------------------------------------|
| **Frontend**| React, React Flow, Shadcn UI, Tailwind CSS                           |
| **Backend** | ASP.NET Core 8 (C#), Entity Framework Core                           |
| **Database**| MySQL                                                                 |
| **Auth**    | Clerk (JWT)                                                          |
| **Integrations** | Google APIs (Gmail, Sheets), MimeKit                            |

---

## 📂 Repo Structure (suggested)

Flow-Forge/
├── backend/                 # ASP.NET Core 8 Web API
│   ├── FlowForge.csproj
│   ├── Controllers/
│   ├── Models/
│   ├── DTOs/
│   ├── Engine/              # FlowEngine, ParsedFlow, Nodes
│   ├── Services/
│   ├── Repositories/
│   ├── appsettings.json
│   └── ...
├── frontend/                # React + React Flow + Shadcn UI
│   ├── src/
│   │   ├── Pages/
│   │   ├── Apis/
│   │   ├── components/
│   │   └── ...
│   ├── .env.local
│   └── vite.config.js
├── .gitignore
├── README.md
└── LICENSE
If you’re currently keeping backend inside the frontend folder, that’s OK—just explain it in this README. You can restructure later.

✅ Prerequisites
.NET 8 SDK

Node.js (LTS)

MySQL 8+

A Clerk account (Frontend API + JWKS URL)

A Google Cloud project (OAuth 2.0 client + enabled Gmail & Sheets APIs)

🔧 Backend Setup (ASP.NET Core)
bash
Copy
Edit
git clone https://github.com/<your-username>/Flow-Forge.git
cd Flow-Forge/backend
Configure secrets (recommended over appsettings.json):

bash
Copy
Edit
dotnet user-secrets init

# Clerk
dotnet user-secrets set "Jwt:Authority" "https://YOUR-CLERK-INSTANCE.clerk.accounts.dev"
dotnet user-secrets set "Jwt:Audience" "your-clerk-audience-if-any" # optional

# Google OAuth (re-use for Gmail & Sheets)
dotnet user-secrets set "Google:ClientId" "YOUR_GOOGLE_CLIENT_ID"
dotnet user-secrets set "Google:ClientSecret" "YOUR_GOOGLE_CLIENT_SECRET"
Update appsettings.json (DB):

json
Copy
Edit
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=FlowForgeDb;User=root;Password=YOUR_PASSWORD;"
}
Run EF migrations & start API:

bash
Copy
Edit
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run
Backend will run at https://localhost:7025

💻 Frontend Setup (React)
bash
Copy
Edit
cd ../frontend
npm install
Create .env.local:

bash
Copy
Edit
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxx
VITE_API_BASE_URL=https://localhost:7025/api
Run:

bash
Copy
Edit
npm run dev
Frontend will run at http://localhost:5173

🔐 OAuth Scopes Used
text
Copy
Edit
https://www.googleapis.com/auth/gmail.send
https://www.googleapis.com/auth/spreadsheets
🧪 How to Use
Sign in with Clerk.

Go to Integrations / Connections → Connect Google (OAuth flow).

Head to Flows → Create New Flow.

Drag nodes: Webhook → Delay → Gmail → Google Sheets.

Save and Run flow (or POST to the webhook endpoint using Postman/Google Forms).

🧭 API (Quick Glance)
Replace with your actual routes if different.

POST /api/flows – Create flow

GET /api/flows/user/{clerkUserId} – List flows for user

POST /api/flows/{id}/run – Run a flow

GET /api/connections/google/connect – Start Google OAuth

GET /api/connections/google/callback – OAuth callback

GET /api/connections – List connected services

DELETE /api/connections/{serviceName} – Disconnect a service

🗺️ Roadmap
 Execution logs UI (per node, per run)

 Template flows (1-click create)

 Conditions & branching UI improvements

 Import/Export flows (JSON)

 Retry & circuit breaker policies (Polly)

 Background job scheduling (Hangfire)

 More actions: Slack, Discord, Trello, Drive

📸 Screenshots / Demo (add later)
<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/24794b69-622a-4681-a43f-063768bcc5c8" width="400"/></td>
    <td><img src="https://github.com/user-attachments/assets/a5087206-6599-4a7f-b023-8bdb4264a038" width="400"/></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/39856029-cf1e-4289-aba1-1c402c893ea2" width="400"/></td>
    <td><img src="https://github.com/user-attachments/assets/fc281875-eb75-40ee-89ba-ee4387fe577a" width="400"/></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/cba182dd-c3e5-407f-9e04-a664a6bd8dfe" width="400"/></td>
    <td><img src="https://github.com/user-attachments/assets/641465e0-5659-48e7-b83f-af6179803456" width="400"/></td>
  </tr>
</table>



🤝 Contributing
Contributions are welcome!

Fork the repo

Create a feature branch: feat/my-awesome-feature

Commit your changes

Open a PR 🎉

📜 License
Licensed under the MIT License. See LICENSE for details.

🙌 Credits
React Flow – amazing node editor library

Clerk – simple auth for modern apps

Google APIs – Gmail & Sheets automation

ASP.NET Core – fast, reliable backend

<p align="center"> Made with ❤️ by <b>Flow‑Forge</b> </p> ```
