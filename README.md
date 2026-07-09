# LEI FleetOps AI – Enterprise Fleet Intelligence & Vehicle Management Platform

A centralized, SaaS-ready vehicle lifecycle tracking, driver dispatch, maintenance scheduler, and reporting dashboard custom-designed for **Laser Experts India LLP (LEI)** operations.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Zustand, Recharts, Lucide Icons, PWA Manifest.
- **Backend**: Node.js, Express, TypeScript, JWT with RBAC validation.
- **Database**: PostgreSQL (UUID architecture, optimized query indexing).
- **Deployment**: Docker, Docker Compose, Nginx, Let's Encrypt SSL.

---

## 🗂️ Folder Structure

```
VMS/
├── database/
│   └── schema.sql             # PostgreSQL tables (29 tables), keys, and indices
├── backend/
│   ├── src/
│   │   ├── config/            # PostgreSQL pool configuration
│   │   ├── middleware/        # JWT Authentication & RBAC checks
│   │   ├── modules/           # Auth, Users, Vehicles, Trips, Fuel, Maintenance, etc.
│   │   └── app.ts             # Express server and routing gateway
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                   # Environment config template
├── frontend/
│   ├── public/
│   │   └── manifest.json      # PWA application support manifest
│   ├── src/
│   │   ├── store/             # Zustand state management
│   │   ├── pages/             # Login, Dashboard, Fleet, Trips, Fuel, Maintenance, etc.
│   │   ├── index.css          # Tailwind presets, dark mode colors
│   │   ├── App.tsx            # Navigation routing layout shell
│   │   └── main.tsx           # React mounting entrypoint
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── index.html
├── Dockerfile.backend
├── Dockerfile.frontend
├── docker-compose.yml
├── nginx.conf                 # Nginx proxy mapping rate limits & compression
└── vps_deployment_guide.md    # Production deployment guide
```

---

## 📊 Fleet Intelligence Metrics & Custom Formulas

1. **Vehicle Performance Index (VPI)**:
   $$\text{VPI} = \frac{\text{Distance Logged (km)}}{\text{Maintenance Cost (INR)}}$$
2. **Vehicle Health Score**:
   $$\text{Health Score} = 100 - \text{Breakdown Penalty} - \text{Overdue Service Penalty}$$
3. **Fleet Utilization Rate**:
   $$\text{Fleet Utilization} = \frac{\text{Active Days}}{\text{Available Days}} \times 100$$
4. **Driver Performance Score**:
   $$\text{Driver Performance} = \text{Trip Completion Rate} \times \text{Fuel Efficiency} \times \text{Inspection Compliance}$$

---

## 🚀 Local Run Guidelines

### Method A: Running with Docker Compose (Recommended)
Build and run the entire ecosystem (Nginx, React, Node API, PostgreSQL) in one command:
```bash
docker compose up --build
```
Access the client dashboard at `http://localhost`.

### Method B: Running Separately in Development Mode

#### 1. Setup Database
Load the PostgreSQL schema:
```bash
psql -U postgres -d vms_fleetops -f database/schema.sql
```

#### 2. Start Express API Backend
```bash
cd backend
npm install
npm run dev
```
Server runs at `http://localhost:5000`.

#### 3. Start React Web Client
```bash
cd frontend
npm install
npm run dev
```
Client runs at `http://localhost:3000`.

---

## 🔐 Credentials for Immediate System Access

Use the following administrator account for testing:
- **Email**: `admin@fleetops.lei`
- **Password**: `admin123`
- **Role Assigned**: `Super Admin`
