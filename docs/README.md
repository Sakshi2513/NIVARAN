# Nivaran Documentation

## Overview

Nivaran is an AI-powered Public Grievance Redressal System with:

- Citizen portal for filing and tracking complaints
- Government dashboard for analytics and high-risk visibility
- Backend API with role-based JWT authentication
- NLP service for complaint classification, severity scoring, and duplicate detection
- Docker support for local development

## Structure

- `frontend/`: Next.js 15 application
- `backend/`: Express + TypeScript API service
- `nlp-service/`: FastAPI AI classification service
- `docker-compose.yml`: Compose file for all services

## Local development

1. Start Docker services:
   - `docker compose up --build`

2. Open the application:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`
   - NLP service: `http://localhost:8000`
