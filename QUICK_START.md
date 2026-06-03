<<<<<<< HEAD
# 🚀 QUICK START - NIVARAN MVP

## Start All Services (3 Terminals)

```bash
# Terminal 1: Backend
cd backend && npm run dev
→ http://localhost:5000/api/health

# Terminal 2: Frontend
cd frontend && npm run dev  
→ http://localhost:3000

# Terminal 3: NLP Service
cd nlp-service && python main.py
→ http://localhost:8000/health
```

**OR use Docker Compose:**
```bash
docker-compose up -d
```

---

## Test Complete Flow

### 1️⃣ Register Citizen
- Go to `http://localhost:3000/auth/register`
- Fill: Name, Email, Password
- Role: Citizen (default)
- Submit → See "Registration successful"

### 2️⃣ Login
- Go to `/auth/login`
- Enter credentials
- ✅ Auto-redirects to `/complaints` (Citizens) or `/dashboard` (Admins)

### 3️⃣ File Complaint (Citizen)
- From `/complaints` → Click "File New Complaint"  
- Fill: Title, Category, Description, Location
- Submit → NLP analyzes immediately
- Check: Complaint appears in history with Severity score

### 4️⃣ View Analytics (Admin Only)
- Login as admin/officer
- Auto-redirect to `/dashboard`
- See: KPI cards, pie chart, bar chart, trend chart, map

---

## ✅ What's Fixed

| Issue | Status |
|-------|--------|
| "Unauthorized" errors | ✅ Fixed - Now checks token |
| Dashboard access control | ✅ Fixed - Role-based redirect |
| Map rendering errors | ✅ Fixed - Dynamic SSR disabled |
| React-Leaflet v5 conflict | ✅ Fixed - Using v4.2.1 |
| Mongoose version | ✅ Fixed - Using 7.8.0 |
| Auth headers missing | ✅ Fixed - Proper Bearer token |

---

## 🔑 Default Test Account

```
Email: admin@nivaran.gov
Password: AdminPass123!
```

(Create via registration form)

---

## 📖 Full Documentation

- **RUNNING_GUIDE.md** - Complete operation manual
- **FINAL_STATUS.md** - Verification & test results
- **README.md** - Project overview
- **SETUP.md** - Installation details
- **PROJECT_SUMMARY.md** - Technical architecture

---

## 🆘 Troubleshooting

**Services not responding?**
```bash
curl http://localhost:5000/api/health    # Backend
curl http://localhost:8000/health        # NLP
```

**Token errors?**
```bash
# In browser console:
localStorage.clear()
# Then login again
```

**Build failed?**
```bash
cd backend && rm -rf node_modules && npm install
cd frontend && rm -rf node_modules && npm install
```

---

**Status: ✅ PRODUCTION READY**

All services running. All errors fixed. Ready to test!
=======
# 🚀 QUICK START - NIVARAN MVP

## Start All Services (3 Terminals)

```bash
# Terminal 1: Backend
cd backend && npm run dev
→ http://localhost:5000/api/health

# Terminal 2: Frontend
cd frontend && npm run dev  
→ http://localhost:3000

# Terminal 3: NLP Service
cd nlp-service && python main.py
→ http://localhost:8000/health
```

**OR use Docker Compose:**
```bash
docker-compose up -d
```

---

## Test Complete Flow

### 1️⃣ Register Citizen
- Go to `http://localhost:3000/auth/register`
- Fill: Name, Email, Password
- Role: Citizen (default)
- Submit → See "Registration successful"

### 2️⃣ Login
- Go to `/auth/login`
- Enter credentials
- ✅ Auto-redirects to `/complaints` (Citizens) or `/dashboard` (Admins)

### 3️⃣ File Complaint (Citizen)
- From `/complaints` → Click "File New Complaint"  
- Fill: Title, Category, Description, Location
- Submit → NLP analyzes immediately
- Check: Complaint appears in history with Severity score

### 4️⃣ View Analytics (Admin Only)
- Login as admin/officer
- Auto-redirect to `/dashboard`
- See: KPI cards, pie chart, bar chart, trend chart, map

---

## ✅ What's Fixed

| Issue | Status |
|-------|--------|
| "Unauthorized" errors | ✅ Fixed - Now checks token |
| Dashboard access control | ✅ Fixed - Role-based redirect |
| Map rendering errors | ✅ Fixed - Dynamic SSR disabled |
| React-Leaflet v5 conflict | ✅ Fixed - Using v4.2.1 |
| Mongoose version | ✅ Fixed - Using 7.8.0 |
| Auth headers missing | ✅ Fixed - Proper Bearer token |

---

## 🔑 Default Test Account

```
Email: admin@nivaran.gov
Password: AdminPass123!
```

(Create via registration form)

---

## 📖 Full Documentation

- **RUNNING_GUIDE.md** - Complete operation manual
- **FINAL_STATUS.md** - Verification & test results
- **README.md** - Project overview
- **SETUP.md** - Installation details
- **PROJECT_SUMMARY.md** - Technical architecture

---

## 🆘 Troubleshooting

**Services not responding?**
```bash
curl http://localhost:5000/api/health    # Backend
curl http://localhost:8000/health        # NLP
```

**Token errors?**
```bash
# In browser console:
localStorage.clear()
# Then login again
```

**Build failed?**
```bash
cd backend && rm -rf node_modules && npm install
cd frontend && rm -rf node_modules && npm install
```

---

**Status: ✅ PRODUCTION READY**

All services running. All errors fixed. Ready to test!
>>>>>>> bd452042014574972e94b317ed3411a10209a40f
