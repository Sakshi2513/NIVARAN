<<<<<<< HEAD
# Nivaran MVP - Complete Running Guide

**Last Updated:** Latest |  **Status:** ✅ All Services Ready  
**Project:** AI-Powered Public Grievance Redressal System

---

## 📋 System Status Summary

| Component | Status | Port | Health Endpoint |
|-----------|--------|------|-----------------|
| Backend API | ✅ Running | 5000 | `http://localhost:5000/api/health` |
| Frontend (Next.js) | ✅ Running | 3000 | `http://localhost:3000` |
| NLP Service | ✅ Running | 8000 | `http://localhost:8000/health` |
| MongoDB | ✅ Running | 27017 | Local container |

---

## 🚀 Quick Start (All-in-One)

### Prerequisites
- Node.js 18+
- Python 3.8+
- Docker & Docker Compose (optional, if using containerized setup)
- npm or yarn

### Option 1: Manual Startup (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
# Starts on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
# Starts on http://localhost:3000
```

**Terminal 3 - NLP Service:**
```bash
cd nlp-service
pip install -r requirements.txt
python main.py
# Starts on http://localhost:8000
```

**Terminal 4 - MongoDB (if not using Docker):**
```bash
# Make sure MongoDB is running on localhost:27017
mongod
```

### Option 2: Docker Compose (Production-like)

```bash
# From project root directory
docker-compose up -d

# Check services
docker-compose ps

# View logs
docker-compose logs -f
```

---

## 🧪 Complete User Flow Testing

### Step 1: Access Application
1. Open browser: `http://localhost:3000`
2. You'll see the Nivaran landing page with:
   - Hero section with app description
   - Key features and statistics
   - FAQ section
   - Navigation to Auth or Complaints

### Step 2: Register as New User
1. Click **"Sign Up"** or navigate to `/auth/register`
2. Fill form:
   - **Name:** Your Full Name
   - **Email:** your-email@example.com
   - **Password:** At least 8 characters
   - **Role:** "Citizen" (default for initial users)
3. Click **Register**
4. Success message: "Registration successful" → Redirects to login

### Step 3: Login
1. Navigate to `/auth/login`
2. Enter credentials
3. Click **Login**
4. **✅ Auto-redirect based on role:**
   - **Citizen** → `/complaints` (File/track complaints)
   - **Officer/DepartmentHead/SuperAdmin** → `/dashboard` (Analytics dashboard)
5. Auth token stored in `localStorage` as `nivaran_token`

### Step 4: File a Complaint (Citizen Flow)
1. From `/complaints` page, click **"File New Complaint"**
2. Form fields:
   - **Title:** Brief complaint title
   - **Category:** Select (Water, Electricity, Roads, Sanitation, Other)
   - **Description:** Detailed description
   - **Location:** City/District name
3. Submit → Triggers NLP analysis:
   - Severity scoring (Low/Medium/High)
   - Auto-categorization
   - Duplicate detection
   - Keyword extraction
4. Complaint stored with:
   - Auto-assigned Complaint ID
   - Creation timestamp
   - Initial status: "Submitted"
   - AI analysis metadata

### Step 5: Track Complaint History
1. From `/complaints` page, scroll to **Complaint History** section
2. View all filed complaints with:
   - Complaint ID
   - Title and Category
   - Status (Submitted → Under Review → Resolved)
   - Severity indicator
   - Filing date

### Step 6: Admin Dashboard (Officer/Admin Only)
1. **Access Control:**
   - Citizens: Redirected to `/complaints`
   - Officers/Admins: Can access `/dashboard`
   - Auto-redirect on role mismatch
2. Dashboard shows:
   - **KPI Cards:** Total complaints, avg resolution time, city heatmap
   - **Category Pie Chart:** Distribution by complaint type
   - **City Bar Chart:** Geographic complaint concentration
   - **Trend Line Chart:** Complaints over time
   - **Map Viewer:** Visual representation of complaint hotspots
3. Real-time data from `/api/analytics/overview`

### Step 7: Test NLP Analysis
1. File a test complaint:
   - Category: "Water"
   - Description: "No water supply in colony for 3 days, critical issue"
   - Location: "Mumbai"
2. Check NLP analysis results:
   - Severity: High (priority keywords detected)
   - Category: Water Supply
   - Keywords: supply, critical
   - Sentiment: Negative

---

## 🔧 Key Fixes & Improvements Made

### Authorization & Auth Flow
✅ **Fixed**: Token validation on protected routes
✅ **Fixed**: Role-based access control on `/dashboard`
✅ **Fixed**: Authorization headers properly passed to all API endpoints
✅ **Added**: Loading states during auth verification
✅ **Added**: Error messages for missing/invalid tokens

### Component Fixes
| Component | Fix | Result |
|-----------|-----|--------|
| `AdminDashboard.tsx` | Added token verification + error UI | No more "Unauthorized" errors |
| `ComplaintForm.tsx` | Auth check before submission | Prevents API errors |
| `ComplaintHistory.tsx` | Token validation in useEffect | Graceful error handling |
| `ComplaintTracker.tsx` | Auth verification | Safe data loading |
| `dashboard/page.tsx` | Role-based access control | Only authorized users see admin panel |
| `login/page.tsx` | Role-based redirection | Citizens → /complaints, Admins → /dashboard |

### API Integration
✅ All endpoints secured with JWT middleware  
✅ CORS configured for `http://localhost:3000`  
✅ Error handling with descriptive messages  
✅ Request/response logging for debugging  

### NLP Service
✅ Complaint analysis pipeline: Categorization → Severity → Duplicates → Keywords  
✅ TF-IDF based duplicate detection (threshold: 0.75 similarity)  
✅ Multi-label category classification  
✅ Sentiment analysis integration  

---

## 📚 API Endpoints Reference

### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - User login, returns JWT token
```

### Complaints
```
POST   /api/complaints          - File new complaint (requires auth)
GET    /api/complaints          - Get user's complaints (requires auth)
PUT    /api/complaints/:id      - Update complaint status (admin only)
```

### Analytics
```
GET    /api/analytics/overview  - Dashboard KPIs (officer+)
GET    /api/analytics/category  - Breakdown by category
GET    /api/analytics/timeline  - Complaints over time
```

### Health
```
GET    /api/health              - Backend health check
GET    /health                  - NLP service health check
```

---

## 🛠️ Troubleshooting

### Issue: "Unauthorized" Error
**Cause:** Token missing or expired  
**Fix:**
1. Login again at `/auth/login`
2. Check browser DevTools → Application → localStorage for `nivaran_token`
3. Ensure token is being sent: Authorization header should contain `Bearer <token>`

### Issue: Complaint Form Shows "Please Log In"
**Cause:** No valid auth token  
**Fix:**
1. Complete login flow: `/auth/login`
2. If persisted, clear localStorage: `localStorage.clear()` in console
3. Refresh and login again

### Issue: Dashboard Redirects to Complaints
**Cause:** User role not Officer/Admin/SuperAdmin  
**Fix:**
1. Create new admin account with role selection (if available)
2. Or register and set role manually in database

### Issue: Services Not Responding
**Check connection:**
```bash
# Backend
curl http://localhost:5000/api/health

# Frontend
curl http://localhost:3000

# NLP Service
curl http://localhost:8000/health
```

### Issue: MongoDB Connection Error
**Fix:**
```bash
# Ensure MongoDB is running
# If using Docker Compose:
docker-compose up -d

# If manual:
mongod  # Run in separate terminal
```

### Issue: Dependencies Not Installing
**Fix:**
```bash
# Backend
cd backend && rm -rf node_modules package-lock.json && npm install

# Frontend  
cd frontend && rm -rf node_modules package-lock.json && npm install

# NLP
cd nlp-service && pip install --upgrade -r requirements.txt
```

---

## 🔐 Test Credentials

### Default Admin Account (Create via registration)
```
Email: admin@nivaran.gov
Password: AdminPass123!
Role: SuperAdmin
```

### Test Citizen Account
```
Email: citizen@example.com  
Password: CitizenPass123!
Role: Citizen
```

---

## 📊 Expected Behavior Checklist

- [ ] Frontend loads without errors at `http://localhost:3000`
- [ ] Can register new account at `/auth/register`
- [ ] Can login and receive JWT token
- [ ] Citizens redirected to `/complaints` after login
- [ ] Can file complaint with all fields
- [ ] Complaint appears in history after filing
- [ ] NLP analysis assigned severity/category
- [ ] Admins can access `/dashboard` with charts
- [ ] Dashboard shows KPI metrics
- [ ] No console errors in browser
- [ ] Auth tokens stored in localStorage
- [ ] Protected routes require valid auth

---

## 📝 Important Environment Files

### Backend Configuration
- `backend/src/app.ts` - Express app setup
- `backend/src/db.ts` - MongoDB connection
- Environment: MongoDB at `mongodb://localhost:27017/nivaran`
- JWT Secret: Set in `app.ts` (update for production)

### Frontend Configuration
- `frontend/lib/api.ts` - API client with auth headers
- `frontend/lib/constants.ts` - Base URL and categories
- Base URL: `http://localhost:5000`

### NLP Service Configuration
- `nlp-service/main.py` - FastAPI application
- Models: TF-IDF, spaCy NLP, transformers
- Runs on `http://localhost:8000`

---

## 🚢 Deployment Ready Checklist

- ✅ All services containerized with Dockerfiles
- ✅ docker-compose.yml configured for all services
- ✅ Environment variables documented
- ✅ Error handling implemented
- ✅ Auth/Authorization working
- ✅ Database persistence configured
- ✅ Health endpoints available
- ✅ CORS configured

**To deploy:**
1. Update `.env` files with production values
2. Replace `localhost` with production domain
3. Use production MongoDB URI
4. Run: `docker-compose -f docker-compose.prod.yml up -d`

---

## 📞 Support & Documentation

- **README.md** - Project overview
- **PROJECT_SUMMARY.md** - Technical architecture
- **SETUP.md** - Initial setup guide
- **API docs** - Available at `/api/docs` (if Swagger enabled)
- **NLP analysis** - See request/response in browser Network tab

---

## ✨ Key Features Summary

1. **Citizen Portal**
   - File grievances with AI categorization
   - Track complaint status in real-time
   - View complaint history

2. **Admin Dashboard**
   - Real-time analytics and KPIs
   - Geographic hotspot visualization
   - Complaint trend analysis
   - Category-wise distribution

3. **AI/NLP Integration**
   - Auto-categorization of complaints
   - Severity scoring and prioritization
   - Duplicate complaint detection
   - Keyword extraction for insights

4. **Government Workflow**
   - Role-based access (Citizen, Officer, Admin)
   - Complaint escalation based on severity
   - Department-wise routing
   - Status tracking and notifications

---

**Ready to run! Start all three services and enjoy the Nivaran platform.**
=======
# Nivaran MVP - Complete Running Guide

**Last Updated:** Latest |  **Status:** ✅ All Services Ready  
**Project:** AI-Powered Public Grievance Redressal System

---

## 📋 System Status Summary

| Component | Status | Port | Health Endpoint |
|-----------|--------|------|-----------------|
| Backend API | ✅ Running | 5000 | `http://localhost:5000/api/health` |
| Frontend (Next.js) | ✅ Running | 3000 | `http://localhost:3000` |
| NLP Service | ✅ Running | 8000 | `http://localhost:8000/health` |
| MongoDB | ✅ Running | 27017 | Local container |

---

## 🚀 Quick Start (All-in-One)

### Prerequisites
- Node.js 18+
- Python 3.8+
- Docker & Docker Compose (optional, if using containerized setup)
- npm or yarn

### Option 1: Manual Startup (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
# Starts on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
# Starts on http://localhost:3000
```

**Terminal 3 - NLP Service:**
```bash
cd nlp-service
pip install -r requirements.txt
python main.py
# Starts on http://localhost:8000
```

**Terminal 4 - MongoDB (if not using Docker):**
```bash
# Make sure MongoDB is running on localhost:27017
mongod
```

### Option 2: Docker Compose (Production-like)

```bash
# From project root directory
docker-compose up -d

# Check services
docker-compose ps

# View logs
docker-compose logs -f
```

---

## 🧪 Complete User Flow Testing

### Step 1: Access Application
1. Open browser: `http://localhost:3000`
2. You'll see the Nivaran landing page with:
   - Hero section with app description
   - Key features and statistics
   - FAQ section
   - Navigation to Auth or Complaints

### Step 2: Register as New User
1. Click **"Sign Up"** or navigate to `/auth/register`
2. Fill form:
   - **Name:** Your Full Name
   - **Email:** your-email@example.com
   - **Password:** At least 8 characters
   - **Role:** "Citizen" (default for initial users)
3. Click **Register**
4. Success message: "Registration successful" → Redirects to login

### Step 3: Login
1. Navigate to `/auth/login`
2. Enter credentials
3. Click **Login**
4. **✅ Auto-redirect based on role:**
   - **Citizen** → `/complaints` (File/track complaints)
   - **Officer/DepartmentHead/SuperAdmin** → `/dashboard` (Analytics dashboard)
5. Auth token stored in `localStorage` as `nivaran_token`

### Step 4: File a Complaint (Citizen Flow)
1. From `/complaints` page, click **"File New Complaint"**
2. Form fields:
   - **Title:** Brief complaint title
   - **Category:** Select (Water, Electricity, Roads, Sanitation, Other)
   - **Description:** Detailed description
   - **Location:** City/District name
3. Submit → Triggers NLP analysis:
   - Severity scoring (Low/Medium/High)
   - Auto-categorization
   - Duplicate detection
   - Keyword extraction
4. Complaint stored with:
   - Auto-assigned Complaint ID
   - Creation timestamp
   - Initial status: "Submitted"
   - AI analysis metadata

### Step 5: Track Complaint History
1. From `/complaints` page, scroll to **Complaint History** section
2. View all filed complaints with:
   - Complaint ID
   - Title and Category
   - Status (Submitted → Under Review → Resolved)
   - Severity indicator
   - Filing date

### Step 6: Admin Dashboard (Officer/Admin Only)
1. **Access Control:**
   - Citizens: Redirected to `/complaints`
   - Officers/Admins: Can access `/dashboard`
   - Auto-redirect on role mismatch
2. Dashboard shows:
   - **KPI Cards:** Total complaints, avg resolution time, city heatmap
   - **Category Pie Chart:** Distribution by complaint type
   - **City Bar Chart:** Geographic complaint concentration
   - **Trend Line Chart:** Complaints over time
   - **Map Viewer:** Visual representation of complaint hotspots
3. Real-time data from `/api/analytics/overview`

### Step 7: Test NLP Analysis
1. File a test complaint:
   - Category: "Water"
   - Description: "No water supply in colony for 3 days, critical issue"
   - Location: "Mumbai"
2. Check NLP analysis results:
   - Severity: High (priority keywords detected)
   - Category: Water Supply
   - Keywords: supply, critical
   - Sentiment: Negative

---

## 🔧 Key Fixes & Improvements Made

### Authorization & Auth Flow
✅ **Fixed**: Token validation on protected routes
✅ **Fixed**: Role-based access control on `/dashboard`
✅ **Fixed**: Authorization headers properly passed to all API endpoints
✅ **Added**: Loading states during auth verification
✅ **Added**: Error messages for missing/invalid tokens

### Component Fixes
| Component | Fix | Result |
|-----------|-----|--------|
| `AdminDashboard.tsx` | Added token verification + error UI | No more "Unauthorized" errors |
| `ComplaintForm.tsx` | Auth check before submission | Prevents API errors |
| `ComplaintHistory.tsx` | Token validation in useEffect | Graceful error handling |
| `ComplaintTracker.tsx` | Auth verification | Safe data loading |
| `dashboard/page.tsx` | Role-based access control | Only authorized users see admin panel |
| `login/page.tsx` | Role-based redirection | Citizens → /complaints, Admins → /dashboard |

### API Integration
✅ All endpoints secured with JWT middleware  
✅ CORS configured for `http://localhost:3000`  
✅ Error handling with descriptive messages  
✅ Request/response logging for debugging  

### NLP Service
✅ Complaint analysis pipeline: Categorization → Severity → Duplicates → Keywords  
✅ TF-IDF based duplicate detection (threshold: 0.75 similarity)  
✅ Multi-label category classification  
✅ Sentiment analysis integration  

---

## 📚 API Endpoints Reference

### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - User login, returns JWT token
```

### Complaints
```
POST   /api/complaints          - File new complaint (requires auth)
GET    /api/complaints          - Get user's complaints (requires auth)
PUT    /api/complaints/:id      - Update complaint status (admin only)
```

### Analytics
```
GET    /api/analytics/overview  - Dashboard KPIs (officer+)
GET    /api/analytics/category  - Breakdown by category
GET    /api/analytics/timeline  - Complaints over time
```

### Health
```
GET    /api/health              - Backend health check
GET    /health                  - NLP service health check
```

---

## 🛠️ Troubleshooting

### Issue: "Unauthorized" Error
**Cause:** Token missing or expired  
**Fix:**
1. Login again at `/auth/login`
2. Check browser DevTools → Application → localStorage for `nivaran_token`
3. Ensure token is being sent: Authorization header should contain `Bearer <token>`

### Issue: Complaint Form Shows "Please Log In"
**Cause:** No valid auth token  
**Fix:**
1. Complete login flow: `/auth/login`
2. If persisted, clear localStorage: `localStorage.clear()` in console
3. Refresh and login again

### Issue: Dashboard Redirects to Complaints
**Cause:** User role not Officer/Admin/SuperAdmin  
**Fix:**
1. Create new admin account with role selection (if available)
2. Or register and set role manually in database

### Issue: Services Not Responding
**Check connection:**
```bash
# Backend
curl http://localhost:5000/api/health

# Frontend
curl http://localhost:3000

# NLP Service
curl http://localhost:8000/health
```

### Issue: MongoDB Connection Error
**Fix:**
```bash
# Ensure MongoDB is running
# If using Docker Compose:
docker-compose up -d

# If manual:
mongod  # Run in separate terminal
```

### Issue: Dependencies Not Installing
**Fix:**
```bash
# Backend
cd backend && rm -rf node_modules package-lock.json && npm install

# Frontend  
cd frontend && rm -rf node_modules package-lock.json && npm install

# NLP
cd nlp-service && pip install --upgrade -r requirements.txt
```

---

## 🔐 Test Credentials

### Default Admin Account (Create via registration)
```
Email: admin@nivaran.gov
Password: AdminPass123!
Role: SuperAdmin
```

### Test Citizen Account
```
Email: citizen@example.com  
Password: CitizenPass123!
Role: Citizen
```

---

## 📊 Expected Behavior Checklist

- [ ] Frontend loads without errors at `http://localhost:3000`
- [ ] Can register new account at `/auth/register`
- [ ] Can login and receive JWT token
- [ ] Citizens redirected to `/complaints` after login
- [ ] Can file complaint with all fields
- [ ] Complaint appears in history after filing
- [ ] NLP analysis assigned severity/category
- [ ] Admins can access `/dashboard` with charts
- [ ] Dashboard shows KPI metrics
- [ ] No console errors in browser
- [ ] Auth tokens stored in localStorage
- [ ] Protected routes require valid auth

---

## 📝 Important Environment Files

### Backend Configuration
- `backend/src/app.ts` - Express app setup
- `backend/src/db.ts` - MongoDB connection
- Environment: MongoDB at `mongodb://localhost:27017/nivaran`
- JWT Secret: Set in `app.ts` (update for production)

### Frontend Configuration
- `frontend/lib/api.ts` - API client with auth headers
- `frontend/lib/constants.ts` - Base URL and categories
- Base URL: `http://localhost:5000`

### NLP Service Configuration
- `nlp-service/main.py` - FastAPI application
- Models: TF-IDF, spaCy NLP, transformers
- Runs on `http://localhost:8000`

---

## 🚢 Deployment Ready Checklist

- ✅ All services containerized with Dockerfiles
- ✅ docker-compose.yml configured for all services
- ✅ Environment variables documented
- ✅ Error handling implemented
- ✅ Auth/Authorization working
- ✅ Database persistence configured
- ✅ Health endpoints available
- ✅ CORS configured

**To deploy:**
1. Update `.env` files with production values
2. Replace `localhost` with production domain
3. Use production MongoDB URI
4. Run: `docker-compose -f docker-compose.prod.yml up -d`

---

## 📞 Support & Documentation

- **README.md** - Project overview
- **PROJECT_SUMMARY.md** - Technical architecture
- **SETUP.md** - Initial setup guide
- **API docs** - Available at `/api/docs` (if Swagger enabled)
- **NLP analysis** - See request/response in browser Network tab

---

## ✨ Key Features Summary

1. **Citizen Portal**
   - File grievances with AI categorization
   - Track complaint status in real-time
   - View complaint history

2. **Admin Dashboard**
   - Real-time analytics and KPIs
   - Geographic hotspot visualization
   - Complaint trend analysis
   - Category-wise distribution

3. **AI/NLP Integration**
   - Auto-categorization of complaints
   - Severity scoring and prioritization
   - Duplicate complaint detection
   - Keyword extraction for insights

4. **Government Workflow**
   - Role-based access (Citizen, Officer, Admin)
   - Complaint escalation based on severity
   - Department-wise routing
   - Status tracking and notifications

---

**Ready to run! Start all three services and enjoy the Nivaran platform.**
>>>>>>> bd452042014574972e94b317ed3411a10209a40f
