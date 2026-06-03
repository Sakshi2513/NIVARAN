<<<<<<< HEAD
# Nivaran MVP - Setup & Deployment Guide

## Project Status

✅ **Complete MVP Build** - All services verified and running:
- **Backend**: Node.js + Express + MongoDB (port 5000)
- **Frontend**: Next.js 15 + React + TypeScript + Tailwind (port 3000)
- **NLP Service**: FastAPI + spaCy + scikit-learn (port 8000)
- **Database**: MongoDB (port 27017)

---

## Quick Start

### Option 1: Local Development (No Docker)

#### Backend Setup
```bash
cd backend
npm install
npm run dev
# Backend running on http://localhost:5000
```

#### Frontend Setup (new terminal)
```bash
cd frontend
npm install
npm run dev
# Frontend running on http://localhost:3000
```

#### NLP Service Setup (new terminal)
```bash
cd nlp-service
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload --port 8000
# NLP service running on http://localhost:8000
```

### Option 2: Docker Compose (All-in-One)

```bash
docker compose up --build
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- NLP Service: http://localhost:8000
- MongoDB: mongodb://localhost:27017

---

## Project Structure

```
Nivaran/
├── frontend/              # Next.js 15 React app
│   ├── app/              # App router pages
│   │   ├── layout.tsx
│   │   ├── page.tsx      # Landing page
│   │   ├── auth/         # Login/Register routes
│   │   ├── complaints/   # Citizen portal
│   │   └── dashboard/    # Admin dashboard
│   ├── components/       # Reusable React components
│   │   ├── Header.tsx
│   │   ├── ComplaintForm.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── MapViewer.tsx # Leaflet maps
│   │   └── charts/       # Recharts visualizations
│   ├── lib/              # Utilities
│   │   ├── api.ts        # API client
│   │   └── constants.ts
│   └── package.json
│
├── backend/              # Express + TypeScript API
│   ├── src/
│   │   ├── server.ts     # Entry point
│   │   ├── app.ts        # Express app setup
│   │   ├── config/
│   │   │   └── db.ts     # MongoDB connection
│   │   ├── models/       # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   ├── Complaint.ts
│   │   │   └── Notification.ts
│   │   ├── controllers/  # Business logic
│   │   │   ├── authController.ts
│   │   │   ├── complaintController.ts
│   │   │   └── analyticsController.ts
│   │   ├── routes/       # API routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── complaintRoutes.ts
│   │   │   └── analyticsRoutes.ts
│   │   └── middleware/   # Auth & error handling
│   │       ├── auth.ts
│   │       └── errorHandler.ts
│   ├── tsconfig.json
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── nlp-service/          # FastAPI Python service
│   ├── main.py           # FastAPI app
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml    # Orchestrate all services
├── docker/               # Supporting Docker files
└── README.md             # Project overview
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new citizen
- `POST /api/auth/login` - Login and get JWT token

### Complaints
- `POST /api/complaints` - File new complaint
- `GET /api/complaints` - List complaints (filtered by role)
- `GET /api/complaints/:id` - Get complaint details
- `PATCH /api/complaints/:id` - Update complaint status
- `POST /api/complaints/:id/escalate` - Escalate complaint

### Analytics (Admin only)
- `GET /api/analytics/overview` - KPI summary
- `GET /api/analytics/location` - Location-based analytics
- `GET /api/analytics/high-risk-zones` - Top risk areas

### NLP Service
- `GET /health` - Service health check
- `POST /analyze` - Analyze complaint text

---

## Features Implemented

### Frontend
✅ Landing page with tagline & CTA buttons
✅ Citizen registration & login
✅ Complaint filing form with geo-location & category selection
✅ Complaint history & tracking table
✅ Admin dashboard with KPI cards
✅ Complaint charts (pie, bar, line)
✅ High-risk zones heatmap
✅ Leaflet map viewer
✅ Dark/light theme toggle
✅ Mobile responsive design

### Backend
✅ JWT authentication with role-based access control
✅ User roles: Citizen, Officer, DepartmentHead, SuperAdmin
✅ MongoDB + Mongoose for data persistence
✅ Complaint categorization (13 categories)
✅ Severity auto-scoring & escalation
✅ Department mapping by category
✅ Analytics aggregation pipeline
✅ Error handling middleware
✅ CORS enabled for frontend

### NLP Service
✅ Complaint text analysis
✅ Sentiment detection
✅ Severity scoring (0-100)
✅ Keyword extraction
✅ Duplicate complaint detection
✅ Category classification
✅ Department mapping
✅ Auto-escalation for critical complaints (score > 80)

---

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://mongo:27017/nivaran
JWT_SECRET=your_secret_key_here
FRONTEND_ORIGIN=http://localhost:3000
NLP_SERVICE_URL=http://localhost:8000
PORT=5000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Database Schema

### User
```
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed with bcrypt),
  role: Enum['Citizen', 'Officer', 'DepartmentHead', 'SuperAdmin'],
  createdAt: Date,
  updatedAt: Date
}
```

### Complaint
```
{
  complaintId: String (unique),
  title: String,
  description: String,
  category: String (one of 13 categories),
  severityScore: Number (0-100),
  severityLevel: String ['Low', 'Medium', 'High', 'Critical'],
  keywords: [String],
  status: String (7 statuses),
  city: String,
  ward: String,
  state: String,
  latitude: Number,
  longitude: Number,
  citizenId: ObjectId (ref: User),
  assignedOfficer: ObjectId (ref: User),
  department: String,
  duplicateOf: String,
  autoEscalated: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Testing Endpoints

### Health Checks
```bash
# Backend
curl http://localhost:5000/api/health

# NLP Service
curl http://localhost:8000/health
```

### Register & Login
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'
```

### File Complaint (with token)
```bash
curl -X POST http://localhost:5000/api/complaints \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "title": "No water supply",
    "description": "No water for 3 days in ward 12",
    "category": "Water",
    "city": "Delhi",
    "ward": "12",
    "state": "Delhi",
    "latitude": 28.6139,
    "longitude": 77.2090
  }'
```

### Analyze Complaint (NLP)
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "title": "No water supply emergency",
    "description": "Critical water shortage in ward 12 for 3 days"
  }'
```

---

## Complaint Severity Rules

- **High Priority Keywords** (30 pts each): death, accident, danger, no water, electric shock, harassment, corruption, violence, emergency, unsafe, fire
- **Medium Priority Keywords** (15 pts each): broken, leakage, dirty, damaged, delay
- **Low Priority Keywords** (5 pts each): request, suggestion, improvement

### Auto-Escalation
- Complaints with severity score > 80 are automatically marked as "Escalated"

### Severity Levels
- Low: 0-30
- Medium: 31-60
- High: 61-80
- Critical: 81-100

---

## Complaint Statuses
1. Submitted - Initial state
2. Under Review - Being reviewed by officer
3. Assigned - Assigned to department
4. In Progress - Being resolved
5. Escalated - High priority
6. Resolved - Completed
7. Rejected - Dismissed

---

## Complaint Categories
1. Roads
2. Water
3. Electricity
4. Garbage
5. Drainage
6. Corruption
7. Street Lights
8. Women Safety
9. Pollution
10. Transport
11. Health
12. Education
13. Other

---

## Troubleshooting

### Backend fails to start
- Ensure MongoDB is running on port 27017
- Check MONGODB_URI environment variable
- Run `npm install` and `npm run build`

### Frontend build fails
- Delete `node_modules` and `.next` folders
- Run `npm install` and `npm run build` again
- Ensure ports 3000 is not in use

### NLP service won't start
- Ensure Python 3.8+ is installed
- Download spaCy model: `python -m spacy download en_core_web_sm`
- Install requirements: `pip install -r requirements.txt`

### CORS errors
- Check FRONTEND_ORIGIN is set correctly in backend .env
- Verify frontend API URL in frontend .env

---

## Development Workflow

1. **Make changes to backend**: Changes auto-reload with `ts-node-dev`
2. **Make changes to frontend**: Changes auto-reload with Next.js dev server
3. **Make changes to NLP**: Restart with `uvicorn main:app --reload`
4. **Test APIs**: Use provided curl commands or Postman

---

## Production Deployment

**Using Docker Compose:**
```bash
docker compose up -d
```

**Using Kubernetes (future):**
- Add kubernentes manifests
- Configure ingress for frontend
- Use MongoDB Atlas for cloud database

---

## Directory Cleanup (Optional)

Remove the nested Nivaran folder if it exists:
```bash
rm -r Nivaran/  # or rmdir Nivaran on Windows if empty
```

---

## Next Steps for Enhancement

- [ ] Add image/file uploads for complaints
- [ ] Implement real-time notifications with WebSockets
- [ ] Add SMS/Email integration
- [ ] Implement complaint rating & feedback system
- [ ] Add officer assignment workflow
- [ ] Create advanced analytics dashboard
- [ ] Add multi-language support
- [ ] Implement rate limiting on APIs
- [ ] Add unit & integration tests
- [ ] Set up CI/CD pipeline

---

## Support

For issues or questions, refer to individual README files:
- `frontend/README.md`
- `backend/README.md`
- `nlp-service/README.md`
- `docs/README.md`
=======
# Nivaran MVP - Setup & Deployment Guide

## Project Status

✅ **Complete MVP Build** - All services verified and running:
- **Backend**: Node.js + Express + MongoDB (port 5000)
- **Frontend**: Next.js 15 + React + TypeScript + Tailwind (port 3000)
- **NLP Service**: FastAPI + spaCy + scikit-learn (port 8000)
- **Database**: MongoDB (port 27017)

---

## Quick Start

### Option 1: Local Development (No Docker)

#### Backend Setup
```bash
cd backend
npm install
npm run dev
# Backend running on http://localhost:5000
```

#### Frontend Setup (new terminal)
```bash
cd frontend
npm install
npm run dev
# Frontend running on http://localhost:3000
```

#### NLP Service Setup (new terminal)
```bash
cd nlp-service
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload --port 8000
# NLP service running on http://localhost:8000
```

### Option 2: Docker Compose (All-in-One)

```bash
docker compose up --build
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- NLP Service: http://localhost:8000
- MongoDB: mongodb://localhost:27017

---

## Project Structure

```
Nivaran/
├── frontend/              # Next.js 15 React app
│   ├── app/              # App router pages
│   │   ├── layout.tsx
│   │   ├── page.tsx      # Landing page
│   │   ├── auth/         # Login/Register routes
│   │   ├── complaints/   # Citizen portal
│   │   └── dashboard/    # Admin dashboard
│   ├── components/       # Reusable React components
│   │   ├── Header.tsx
│   │   ├── ComplaintForm.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── MapViewer.tsx # Leaflet maps
│   │   └── charts/       # Recharts visualizations
│   ├── lib/              # Utilities
│   │   ├── api.ts        # API client
│   │   └── constants.ts
│   └── package.json
│
├── backend/              # Express + TypeScript API
│   ├── src/
│   │   ├── server.ts     # Entry point
│   │   ├── app.ts        # Express app setup
│   │   ├── config/
│   │   │   └── db.ts     # MongoDB connection
│   │   ├── models/       # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   ├── Complaint.ts
│   │   │   └── Notification.ts
│   │   ├── controllers/  # Business logic
│   │   │   ├── authController.ts
│   │   │   ├── complaintController.ts
│   │   │   └── analyticsController.ts
│   │   ├── routes/       # API routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── complaintRoutes.ts
│   │   │   └── analyticsRoutes.ts
│   │   └── middleware/   # Auth & error handling
│   │       ├── auth.ts
│   │       └── errorHandler.ts
│   ├── tsconfig.json
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── nlp-service/          # FastAPI Python service
│   ├── main.py           # FastAPI app
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml    # Orchestrate all services
├── docker/               # Supporting Docker files
└── README.md             # Project overview
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new citizen
- `POST /api/auth/login` - Login and get JWT token

### Complaints
- `POST /api/complaints` - File new complaint
- `GET /api/complaints` - List complaints (filtered by role)
- `GET /api/complaints/:id` - Get complaint details
- `PATCH /api/complaints/:id` - Update complaint status
- `POST /api/complaints/:id/escalate` - Escalate complaint

### Analytics (Admin only)
- `GET /api/analytics/overview` - KPI summary
- `GET /api/analytics/location` - Location-based analytics
- `GET /api/analytics/high-risk-zones` - Top risk areas

### NLP Service
- `GET /health` - Service health check
- `POST /analyze` - Analyze complaint text

---

## Features Implemented

### Frontend
✅ Landing page with tagline & CTA buttons
✅ Citizen registration & login
✅ Complaint filing form with geo-location & category selection
✅ Complaint history & tracking table
✅ Admin dashboard with KPI cards
✅ Complaint charts (pie, bar, line)
✅ High-risk zones heatmap
✅ Leaflet map viewer
✅ Dark/light theme toggle
✅ Mobile responsive design

### Backend
✅ JWT authentication with role-based access control
✅ User roles: Citizen, Officer, DepartmentHead, SuperAdmin
✅ MongoDB + Mongoose for data persistence
✅ Complaint categorization (13 categories)
✅ Severity auto-scoring & escalation
✅ Department mapping by category
✅ Analytics aggregation pipeline
✅ Error handling middleware
✅ CORS enabled for frontend

### NLP Service
✅ Complaint text analysis
✅ Sentiment detection
✅ Severity scoring (0-100)
✅ Keyword extraction
✅ Duplicate complaint detection
✅ Category classification
✅ Department mapping
✅ Auto-escalation for critical complaints (score > 80)

---

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://mongo:27017/nivaran
JWT_SECRET=your_secret_key_here
FRONTEND_ORIGIN=http://localhost:3000
NLP_SERVICE_URL=http://localhost:8000
PORT=5000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Database Schema

### User
```
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed with bcrypt),
  role: Enum['Citizen', 'Officer', 'DepartmentHead', 'SuperAdmin'],
  createdAt: Date,
  updatedAt: Date
}
```

### Complaint
```
{
  complaintId: String (unique),
  title: String,
  description: String,
  category: String (one of 13 categories),
  severityScore: Number (0-100),
  severityLevel: String ['Low', 'Medium', 'High', 'Critical'],
  keywords: [String],
  status: String (7 statuses),
  city: String,
  ward: String,
  state: String,
  latitude: Number,
  longitude: Number,
  citizenId: ObjectId (ref: User),
  assignedOfficer: ObjectId (ref: User),
  department: String,
  duplicateOf: String,
  autoEscalated: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Testing Endpoints

### Health Checks
```bash
# Backend
curl http://localhost:5000/api/health

# NLP Service
curl http://localhost:8000/health
```

### Register & Login
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'
```

### File Complaint (with token)
```bash
curl -X POST http://localhost:5000/api/complaints \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "title": "No water supply",
    "description": "No water for 3 days in ward 12",
    "category": "Water",
    "city": "Delhi",
    "ward": "12",
    "state": "Delhi",
    "latitude": 28.6139,
    "longitude": 77.2090
  }'
```

### Analyze Complaint (NLP)
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "title": "No water supply emergency",
    "description": "Critical water shortage in ward 12 for 3 days"
  }'
```

---

## Complaint Severity Rules

- **High Priority Keywords** (30 pts each): death, accident, danger, no water, electric shock, harassment, corruption, violence, emergency, unsafe, fire
- **Medium Priority Keywords** (15 pts each): broken, leakage, dirty, damaged, delay
- **Low Priority Keywords** (5 pts each): request, suggestion, improvement

### Auto-Escalation
- Complaints with severity score > 80 are automatically marked as "Escalated"

### Severity Levels
- Low: 0-30
- Medium: 31-60
- High: 61-80
- Critical: 81-100

---

## Complaint Statuses
1. Submitted - Initial state
2. Under Review - Being reviewed by officer
3. Assigned - Assigned to department
4. In Progress - Being resolved
5. Escalated - High priority
6. Resolved - Completed
7. Rejected - Dismissed

---

## Complaint Categories
1. Roads
2. Water
3. Electricity
4. Garbage
5. Drainage
6. Corruption
7. Street Lights
8. Women Safety
9. Pollution
10. Transport
11. Health
12. Education
13. Other

---

## Troubleshooting

### Backend fails to start
- Ensure MongoDB is running on port 27017
- Check MONGODB_URI environment variable
- Run `npm install` and `npm run build`

### Frontend build fails
- Delete `node_modules` and `.next` folders
- Run `npm install` and `npm run build` again
- Ensure ports 3000 is not in use

### NLP service won't start
- Ensure Python 3.8+ is installed
- Download spaCy model: `python -m spacy download en_core_web_sm`
- Install requirements: `pip install -r requirements.txt`

### CORS errors
- Check FRONTEND_ORIGIN is set correctly in backend .env
- Verify frontend API URL in frontend .env

---

## Development Workflow

1. **Make changes to backend**: Changes auto-reload with `ts-node-dev`
2. **Make changes to frontend**: Changes auto-reload with Next.js dev server
3. **Make changes to NLP**: Restart with `uvicorn main:app --reload`
4. **Test APIs**: Use provided curl commands or Postman

---

## Production Deployment

**Using Docker Compose:**
```bash
docker compose up -d
```

**Using Kubernetes (future):**
- Add kubernentes manifests
- Configure ingress for frontend
- Use MongoDB Atlas for cloud database

---

## Directory Cleanup (Optional)

Remove the nested Nivaran folder if it exists:
```bash
rm -r Nivaran/  # or rmdir Nivaran on Windows if empty
```

---

## Next Steps for Enhancement

- [ ] Add image/file uploads for complaints
- [ ] Implement real-time notifications with WebSockets
- [ ] Add SMS/Email integration
- [ ] Implement complaint rating & feedback system
- [ ] Add officer assignment workflow
- [ ] Create advanced analytics dashboard
- [ ] Add multi-language support
- [ ] Implement rate limiting on APIs
- [ ] Add unit & integration tests
- [ ] Set up CI/CD pipeline

---

## Support

For issues or questions, refer to individual README files:
- `frontend/README.md`
- `backend/README.md`
- `nlp-service/README.md`
- `docs/README.md`
>>>>>>> bd452042014574972e94b317ed3411a10209a40f
