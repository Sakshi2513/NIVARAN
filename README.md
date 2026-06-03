<<<<<<< HEAD
# Nivaran

## Overview

Nivaran is an AI-powered Public Grievance Redressal System that combines a citizen complaint portal, a government analytics dashboard, and an NLP classification service.

### Tech stack

- Frontend: Next.js 15 + React + TypeScript + Tailwind + Recharts + Leaflet
- Backend: Node.js + Express + TypeScript + MongoDB + Mongoose + JWT
- NLP service: Python FastAPI + spaCy + transformers + scikit-learn
- Containerization: Docker Compose

## Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### NLP service

```bash
cd nlp-service
pip install -r requirements.txt
uvicorn main:app --reload
```

### Docker

```bash
docker compose up --build
```

## Services

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- NLP service: `http://localhost:8000`
- MongoDB: `mongodb://localhost:27017`

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/complaints`
- `GET /api/complaints`
- `GET /api/complaints/:id`
- `PATCH /api/complaints/:id`
- `POST /api/complaints/:id/escalate`
- `GET /api/analytics/overview`
- `GET /api/analytics/location`
- `GET /api/analytics/high-risk-zones`
=======
# Nivaran

## Overview

Nivaran is an AI-powered Public Grievance Redressal System that combines a citizen complaint portal, a government analytics dashboard, and an NLP classification service.

### Tech stack

- Frontend: Next.js 15 + React + TypeScript + Tailwind + Recharts + Leaflet
- Backend: Node.js + Express + TypeScript + MongoDB + Mongoose + JWT
- NLP service: Python FastAPI + spaCy + transformers + scikit-learn
- Containerization: Docker Compose

## Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### NLP service

```bash
cd nlp-service
pip install -r requirements.txt
uvicorn main:app --reload
```

### Docker

```bash
docker compose up --build
```

## Services

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- NLP service: `http://localhost:8000`
- MongoDB: `mongodb://localhost:27017`

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/complaints`
- `GET /api/complaints`
- `GET /api/complaints/:id`
- `PATCH /api/complaints/:id`
- `POST /api/complaints/:id/escalate`
- `GET /api/analytics/overview`
- `GET /api/analytics/location`
- `GET /api/analytics/high-risk-zones`
>>>>>>> bd452042014574972e94b317ed3411a10209a40f
