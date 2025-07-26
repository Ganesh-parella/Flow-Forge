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

## 📚 Table of Contents
- [🚀 Overview](#-overview)
- [✨ Features](#-features)
- [🧱 Architecture](#-architecture)
- [🛠 Tech Stack](#-tech-stack)
- [📂 Project Structure](#-project-structure)
- [✅ Prerequisites](#-prerequisites)
- [🔧 Backend Setup](#-backend-setup-aspnet-core)
- [💻 Frontend Setup](#-frontend-setup-react)
- [🔐 OAuth Scopes](#-oauth-scopes)
- [🧪 Quick Start](#-quick-start)
- [🧭 API Endpoints](#-api-endpoints-example)
- [🗺 Roadmap](#-roadmap)
- [📸 Screenshots](#-screenshots)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## 🚀 Overview

**Flow‑Forge** is a modern, visual automation platform inspired by **Zapier**. It allows users to connect services like **Gmail**, **Google Sheets**, and **Webhooks** using an intuitive **drag‑and‑drop flow builder**.  
Flows can include **delays**, **conditions**, and multiple actions — all powered by a **pluggable .NET execution engine**.

---

## ✨ Features

- **Visual Flow Builder** — No-code canvas powered by **React Flow**.
- **Webhook Triggers** — Kick off flows from external events.
- **Gmail Integration** — Send emails via Google OAuth2.
- **Google Sheets Node** — Append data to spreadsheets.
- **Delay & Conditional Nodes** — Add logic & timing to flows.
- **Pluggable Node Architecture** — Extend services without core changes.
- **Secure Authentication** — Multi-tenant with **Clerk** & JWT validation.
- **Execution Logs** — Backend run history for debugging.

---
🧱 Architecture
mermaid
Copy
Edit
```mermaid
graph TD
    A[Frontend (React + React Flow + Shadcn UI)] -->|JWT (Clerk)| B[Backend (ASP.NET Core 8)]
    B -->|EF Core + MySQL| C[(Database: MySQL)]
    B --> D[Pluggable Flow Engine]
    D --> E[Triggers, Actions, Conditions]
    B --> F[Google OAuth2 (Gmail & Sheets)]
```
🛠 Tech Stack
Layer	Technologies
Frontend	React 18, React Flow, Shadcn UI, Tailwind CSS
Backend	ASP.NET Core 8 (C#), Entity Framework Core
Database	MySQL
Auth	Clerk (JWT-based authentication)
Integrations	Google APIs (Gmail, Sheets), MimeKit

📂 Project Structure
bash
Copy
Edit
```bash
Flow-Forge/
├── backend/                 # ASP.NET Core 8 Web API
│   ├── Controllers/
│   ├── Models/
│   ├── DTOs/
│   ├── Engine/              # FlowEngine, Nodes, Execution logic
│   ├── Services/
│   ├── Repositories/
│   ├── FlowForge.csproj
│   ├── appsettings.json
│   └── ...
├── frontend/                # React + React Flow + Shadcn UI
│   ├── src/
│   │   ├── pages/
│   │   ├── apis/
│   │   ├── components/
│   │   └── ...
│   ├── .env.local
│   └── vite.config.js
├── .gitignore
├── README.md
└── LICENSE
```
✅ Prerequisites
.NET 8 SDK

Node.js (LTS)

MySQL 8+

Clerk account (Frontend API + JWKS URL)

Google Cloud Project with Gmail & Sheets APIs enabled

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
dotnet user-secrets set "Jwt:Authority" "https://YOUR-CLERK-INSTANCE.clerk.accounts.dev"
dotnet user-secrets set "Jwt:Audience" "your-clerk-audience-if-any"
dotnet user-secrets set "Google:ClientId" "YOUR_GOOGLE_CLIENT_ID"
dotnet user-secrets set "Google:ClientSecret" "YOUR_GOOGLE_CLIENT_SECRET"
Update DB connection in appsettings.json:

json
Copy
Edit
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=FlowForgeDb;User=root;Password=YOUR_PASSWORD;"
}
Run migrations & start API:

bash
Copy
Edit
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run
Backend runs at https://localhost:7025.

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
Start development server:

bash
Copy
Edit
npm run dev
Frontend runs at http://localhost:5173.

🔐 OAuth Scopes
arduino
Copy
Edit
https://www.googleapis.com/auth/gmail.send
https://www.googleapis.com/auth/spreadsheets
🧪 Quick Start
Sign in using Clerk.

Go to Integrations → Connect Google (OAuth).

Create a new flow: Webhook → Delay → Gmail → Google Sheets.

Save & Run flow, or trigger via POST to webhook.

🧭 API Endpoints (Example)
POST /api/flows – Create flow

GET /api/flows/user/{clerkUserId} – List user flows

POST /api/flows/{id}/run – Execute flow

GET /api/connections/google/connect – Google OAuth start

GET /api/connections/google/callback – OAuth callback

GET /api/connections – List connected services

DELETE /api/connections/{serviceName} – Disconnect service

🗺 Roadmap
 Execution logs UI (per node/run)

 Template flows (1-click setup)

 Advanced branching & conditions

 Import/Export flows (JSON)

 Retry & circuit breaker (Polly)

 Background job scheduling (Hangfire)

 New integrations: Slack, Discord, Trello, Drive

📸 Screenshots
<table> <tr> <td><img src="https://github.com/user-attachments/assets/24794b69-622a-4681-a43f-063768bcc5c8" width="400"/></td> <td><img src="https://github.com/user-attachments/assets/a5087206-6599-4a7f-b023-8bdb4264a038" width="400"/></td> </tr> <tr> <td><img src="https://github.com/user-attachments/assets/39856029-cf1e-4289-aba1-1c402c893ea2" width="400"/></td> <td><img src="https://github.com/user-attachments/assets/fc281875-eb75-40ee-89ba-ee4387fe577a" width="400"/></td> </tr> <div align="center">
<img src="https://github.com/user-attachments/assets/cba182dd-c3e5-407f-9e04-a664a6bd8dfe" width="400" /> </table>
🤝 Contributing
Contributions are welcome!

Fork the repository.

Create a feature branch (feat/my-awesome-feature).

Commit changes and push.

Open a Pull Request 🎉.

📜 License
This project is licensed under the MIT License. See LICENSE for details.

<p align="center">Made with ❤️ by <b>Flow‑Forge Team</b></p> 
