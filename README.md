# 🚨 Nivaran
### AI-Powered Public Grievance Redressal System

Transform how citizens report civic issues and how governments respond to them — automated classification, severity scoring, duplicate detection, and real-time analytics, all in one platform.

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Backend-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-NLP_Service-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

# 🚀 Overview

**Nivaran** ("Nivaran" means "resolution" in Hindi) is an AI-powered public grievance redressal platform that helps citizens report civic issues — broken roads, water shortages, electrical hazards, corruption, safety concerns — and helps government departments triage, track, and resolve them faster.

Instead of grievances sitting in an unsorted queue, Nivaran automatically classifies each complaint into the right department, scores its urgency, flags likely duplicates, and auto-escalates anything critical — giving officers and administrators a real-time, data-driven view of what needs attention first.

The platform is built as three independently deployable services — a citizen/admin-facing web app, a core business API, and a dedicated NLP microservice — containerized together with Docker Compose for easy deployment.

---

# ✨ Key Features

### 📝 Citizen Complaint Portal
- Complaint filing with title, description, category, and geo-tagged location
- Complaint history and status tracking table
- Real-time complaint status updates
- Mobile-responsive design with dark/light theme

### 🔐 Authentication & Access Control
- JWT-based authentication (register/login)
- Role-based access control across 4 roles: **Citizen, Officer, DepartmentHead, SuperAdmin**
- Password hashing with bcrypt

### 🧠 AI-Powered NLP Analysis
- Automatic complaint categorization (13 categories)
- Rule-based severity scoring (0–100 scale)
- Sentiment analysis
- Keyword extraction using spaCy
- Duplicate complaint detection via TF-IDF similarity
- Automatic department mapping
- Auto-escalation for critical complaints (severity > 80)

### 📊 Admin Analytics Dashboard
- KPI overview cards
- Category distribution (pie chart)
- City-wise complaint volume (bar chart)
- Complaint trend over time (line chart)
- Interactive high-risk zones map (Leaflet)

### 🗺️ Geo-Spatial Visualization
- Interactive map viewer for complaint locations
- High-risk zone heatmap for administrators
- Location-based analytics (city, ward, state)

### ⚙️ Infrastructure
- Dockerized microservices (frontend, backend, NLP service, MongoDB)
- Graceful MongoDB connection fallback
- CORS-configured REST APIs
- Centralized error handling middleware

---

# 🛠️ Technology Stack

## Frontend
- **Next.js 15** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Recharts** — data visualization
- **Leaflet** — interactive maps

## Backend
- **Node.js + Express**
- **TypeScript**
- **MongoDB + Mongoose**
- **JWT (jsonwebtoken)** — authentication
- **bcrypt** — password hashing

## NLP Service
- **Python 3.12**
- **FastAPI**
- **spaCy** — keyword/entity extraction
- **scikit-learn** — TF-IDF vectorization & similarity scoring
- **transformers**

## DevOps
- **Docker** + **Docker Compose**
- MongoDB 7.0

---

# 🏗️ Project Architecture

```
Nivaran/
├── frontend/                    # Next.js React application
│   ├── app/
│   │   ├── page.tsx             # Landing page
│   │   ├── layout.tsx           # Root layout with theme provider
│   │   ├── globals.css
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── complaints/page.tsx  # Citizen portal
│   │   └── dashboard/page.tsx   # Admin dashboard
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── ComplaintForm.tsx
│   │   ├── ComplaintHistory.tsx
│   │   ├── ComplaintTracker.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── MapViewer.tsx
│   │   ├── LandingFeatureGrid.tsx
│   │   ├── LandingStats.tsx
│   │   ├── LandingFaq.tsx
│   │   └── charts/
│   │       ├── CategoryPieChart.tsx
│   │       ├── CityBarChart.tsx
│   │       └── TrendLineChart.tsx
│   ├── lib/
│   │   ├── api.ts               # API client
│   │   └── constants.ts
│   ├── public/
│   └── Dockerfile
│
├── backend/                     # Express + TypeScript API
│   ├── src/
│   │   ├── server.ts            # Entry point
│   │   ├── app.ts               # Express setup
│   │   ├── config/
│   │   │   └── db.ts            # MongoDB connection (graceful fallback)
│   │   ├── models/
│   │   │   ├── User.ts          # User schema + bcrypt hashing
│   │   │   ├── Complaint.ts     # Complaint schema (13 categories)
│   │   │   └── Notification.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── complaintController.ts
│   │   │   └── analyticsController.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── complaintRoutes.ts
│   │   │   └── analyticsRoutes.ts
│   │   └── middleware/
│   │       ├── auth.ts          # JWT protect + role-based authorize
│   │       └── errorHandler.ts
│   └── Dockerfile
│
├── nlp-service/                 # FastAPI Python service
│   ├── main.py                  # Text analysis, scoring, classification
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker/                      # Docker support docs
├── docs/                        # Project documentation
├── docker-compose.yml           # Orchestrates all services
├── README.md
└── SETUP.md
```

### Architecture Overview

- **Frontend:** Next.js app serving the public landing page, citizen complaint portal, and role-gated admin dashboard.
- **Backend:** Express REST API handling authentication, complaint CRUD, escalation, and analytics — talks to MongoDB and forwards complaint text to the NLP service.
- **NLP Service:** Independent FastAPI microservice performing categorization, severity scoring, keyword extraction, sentiment analysis, and duplicate detection — decoupled so it can be scaled or swapped independently of the core API.
- **Database:** MongoDB stores users, complaints, and notifications as documents.

---

# ⚙️ Installation & Setup

## Prerequisites
- Node.js (v18+)
- Python 3.12
- MongoDB
- Docker (optional, for containerized setup)

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Sakshi2513/NIVARAN.git
cd NIVARAN
```

## 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Runs at: `http://localhost:3000`

## 3️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Runs at: `http://localhost:5000`

Create a `.env` file inside `backend/`:

```
MONGODB_URI=mongodb://localhost:27017/nivaran
JWT_SECRET=your_jwt_secret_key
FRONTEND_ORIGIN=http://localhost:3000
NLP_SERVICE_URL=http://localhost:8000
PORT=5000
```

## 4️⃣ NLP Service Setup

```bash
cd nlp-service
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload --port 8000
```

Runs at: `http://localhost:8000`

## 5️⃣ Run Everything with Docker (Recommended)

```bash
docker compose up --build
```

This starts all four containers (frontend, backend, NLP service, MongoDB) together.

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- NLP API: `http://localhost:8000`
- MongoDB: `mongodb://localhost:27017`

---

# 📋 API Reference

### Health Checks
```
GET /api/health          → Backend health
GET /health               → NLP service health
```

### Authentication
```
POST /api/auth/register
POST /api/auth/login
```

### Complaints
```
POST   /api/complaints                 → File a new complaint
GET    /api/complaints                 → List complaints
GET    /api/complaints/:id             → Get complaint details
PATCH  /api/complaints/:id             → Update complaint
POST   /api/complaints/:id/escalate    → Manually escalate a complaint
```

### Analytics (Admin only)
```
GET /api/analytics/overview            → KPI overview stats
GET /api/analytics/location            → Location-based analytics
GET /api/analytics/high-risk-zones     → High-risk zone data for map
```

### NLP Analysis
```
POST /analyze
Body: { "title": "...", "description": "..." }

Example response:
{
  "category": "Water",
  "keywords": ["no water supply", "3 days", "ward"],
  "severityScore": 73,
  "severityLevel": "High",
  "sentiment": "Negative",
  "department": "Water Management",
  "duplicate": false
}
```

---

# 📊 Database Schemas

### User Collection
| Field | Type |
|---|---|
| name | String |
| email | String (unique) |
| password | String (bcrypt-hashed) |
| role | Enum: Citizen, Officer, DepartmentHead, SuperAdmin |
| timestamps | createdAt, updatedAt |

### Complaint Collection
| Field | Type |
|---|---|
| complaintId | String (unique) |
| title | String |
| description | String |
| category | String (1 of 13) |
| severityScore | Number (0–100) |
| severityLevel | String: Low / Medium / High / Critical |
| keywords | Array of Strings |
| status | Enum (7 statuses) |
| location | { city, ward, state, latitude, longitude } |
| citizenId | ObjectId → User |
| assignedOfficer | ObjectId → User |
| department | String (auto-mapped) |
| duplicateOf | String |
| autoEscalated | Boolean |
| timestamps | createdAt, updatedAt |

---

# 🧠 NLP & Scoring Logic

### Complaint Categories (13)
Roads, Water, Electricity, Garbage, Drainage, Corruption, Street Lights, Women Safety, Pollution, Transport, Health, Education, Other

### Severity Scoring Rules
| Keyword Tier | Examples | Weight |
|---|---|---|
| High Priority | death, accident, danger, no water, electric shock, harassment, corruption, violence, emergency, unsafe, fire | +30 |
| Medium Priority | broken, leakage, dirty, damaged, delay | +15 |
| Low Priority | request, suggestion, improvement | +5 |
| Text length bonus | — | up to max score of 100 |

### Auto-Escalation
Complaints scoring **above 80** are automatically marked **"Escalated"** and surfaced to department heads without waiting for manual review.

### Duplicate Detection
Uses **TF-IDF vectorization** + **cosine similarity** to compare a new complaint's text against existing complaints in the same area/category, flagging likely duplicates (`duplicateOf`) to prevent redundant officer assignments.

---

# 🌟 Why Nivaran?

Traditional grievance systems treat every complaint the same — first come, first served — with no way to distinguish a genuine emergency from a routine request until a human reads it. Nivaran automates that first pass:

- 🤖 **Automatic Triage** — every complaint is categorized, scored, and routed the moment it's filed, no manual sorting required.
- 🚨 **Auto-Escalation** — critical complaints reach decision-makers immediately instead of waiting in a queue.
- 🔁 **Duplicate Prevention** — avoids wasted officer time on the same issue reported multiple times.
- 🗺️ **Geographic Insight** — high-risk zone mapping helps departments spot systemic problem areas, not just individual complaints.
- 🔐 **Role-Aware Access** — citizens, officers, department heads, and super admins each see exactly what's relevant to them.
- 🧩 **Modular Architecture** — the NLP layer is a separate service, so classification logic can evolve independently of the core platform.

---

## 🎯 Use Cases

- 🏛️ Municipal & local government grievance systems
- 🚰 Utility departments (water, electricity, drainage)
- 🚧 Public works & infrastructure complaint tracking
- 👮 Public safety and women's safety reporting
- 🏥 Health & sanitation issue tracking
- 📊 Government transparency and accountability dashboards

---

## 🚧 Roadmap

- [ ] Real-time notifications (WebSocket)
- [ ] File/image upload for complaint evidence
- [ ] SMS/Email integration
- [ ] Complaint rating & feedback system
- [ ] Officer assignment workflow
- [ ] Multi-language support
- [ ] Rate limiting & API throttling
- [ ] Unit & integration test suite
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Production deployment (AWS/GCP/Azure)

---

## ⭐ If you found this project useful, consider giving it a star!

**Made with ❤️ by Sakshi Sheogekar**
