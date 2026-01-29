# 🚀 Fitness Tracker - Quick Start Guide

## ✅ What's Been Set Up

### Frontend (React + Vite)
- ✅ Project initialized with Vite
- ✅ Running on **http://localhost:5174**
- ✅ Ready for development

### Backend (Node.js + Express)
- ✅ Server initialized with Express.js
- ✅ Running on **http://localhost:5000**
- ✅ All dependencies installed
- ✅ Authentication system ready
- ✅ MongoDB models created
- ✅ API routes structured

---

## 📁 Project Structure

```
fitness-tracker/
├── src/                    # Frontend React app
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/                 # Backend Node.js app
│   ├── controllers/        # Request handlers
│   │   └── auth.controller.js
│   ├── middleware/         # Auth middleware
│   │   └── auth.middleware.js
│   ├── models/            # MongoDB models
│   │   ├── User.model.js
│   │   ├── Trainer.model.js
│   │   └── Class.model.js
│   ├── routes/            # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── trainer.routes.js
│   │   ├── class.routes.js
│   │   ├── slot.routes.js
│   │   ├── booking.routes.js
│   │   ├── forum.routes.js
│   │   ├── admin.routes.js
│   │   ├── newsletter.routes.js
│   │   └── payment.routes.js
│   ├── .env               # Environment variables
│   ├── server.js          # Main server file
│   └── package.json
├── README.md              # Main documentation
├── DATABASE_SCHEMA.md     # Database reference
└── PROJECT_SUMMARY.md     # Project overview
```

---

## 🌐 Currently Running

### Frontend
- **URL**: http://localhost:5174
- **Status**: ✅ Running
- **Framework**: React 18 + Vite

### Backend
- **URL**: http://localhost:5000
- **Status**: ✅ Running (without MongoDB)
- **Framework**: Express.js
- **Test Endpoint**: http://localhost:5000/health

---

## ⚠️ MongoDB Setup Required

The server is running but **MongoDB is not connected**. You have two options:

### Option 1: Install MongoDB Locally (Recommended for Development)

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Download for Windows
   - Install with default settings

2. **Start MongoDB Service**
   ```bash
   # MongoDB should start automatically after installation
   # Or start manually:
   net start MongoDB
   ```

3. **Verify Connection**
   - Restart the server: `npm run dev` in the server folder
   - You should see: "✅ MongoDB connected successfully"

### Option 2: Use MongoDB Atlas (Cloud Database)

1. **Create Free Account**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Free" tier
   - Select a cloud provider and region

3. **Get Connection String**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

4. **Update .env File**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitness-tracker?retryWrites=true&w=majority
   ```
   Replace `username` and `password` with your credentials

5. **Restart Server**
   - The server will automatically reconnect

---

## 🔥 Firebase Setup (Required for Authentication)

1. **Create Firebase Project**
   - Visit: https://console.firebase.google.com/
   - Click "Add project"
   - Follow the setup wizard

2. **Enable Authentication**
   - Go to "Authentication" in Firebase Console
   - Click "Get started"
   - Enable:
     - Email/Password
     - Google
     - Facebook (optional)

3. **Get Firebase Config**
   - Go to Project Settings
   - Scroll to "Your apps"
   - Click web icon (</>)
   - Copy the config object

4. **Add to Frontend**
   Create `src/firebase.config.js`:
   ```javascript
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';

   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   ```

5. **Get Firebase Admin SDK**
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely

6. **Update Backend .env**
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   ```

---

## 💳 Stripe Setup (For Payments)

1. **Create Stripe Account**
   - Visit: https://dashboard.stripe.com/register
   - Sign up for free

2. **Get API Keys**
   - Go to Developers → API keys
   - Copy "Publishable key" and "Secret key"

3. **Update Environment Variables**
   
   **Frontend** (create `.env` in root):
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   ```

   **Backend** (update `server/.env`):
   ```env
   STRIPE_SECRET_KEY=sk_test_your_key
   ```

---

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:5000/health
```

### Test Routes
```bash
# Auth routes
curl http://localhost:5000/api/auth/register

# User routes
curl http://localhost:5000/api/users/profile

# Trainer routes
curl http://localhost:5000/api/trainers

# Class routes
curl http://localhost:5000/api/classes
```

---

## 📋 Next Steps

### Immediate Tasks
1. ✅ ~~Set up project structure~~ (Done)
2. ✅ ~~Install dependencies~~ (Done)
3. ✅ ~~Create server~~ (Done)
4. ⏳ Install MongoDB or set up MongoDB Atlas
5. ⏳ Create Firebase project
6. ⏳ Install Tailwind CSS on frontend
7. ⏳ Create authentication UI

### Development Workflow

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd server
npm run dev
```

Both servers will auto-reload when you make changes!

---

## 📚 Documentation References

1. **[README.md](file:///d:/Tasnim/fitness-tracker/README.md)** - Complete project documentation
2. **[implementation_plan.md](file:///C:/Users/rafee/.gemini/antigravity/brain/674faad9-e61b-4224-91bc-88e51ccc5bb7/implementation_plan.md)** - 45-day development plan
3. **[task.md](file:///C:/Users/rafee/.gemini/antigravity/brain/674faad9-e61b-4224-91bc-88e51ccc5bb7/task.md)** - Task checklist (250+ tasks)
4. **[DATABASE_SCHEMA.md](file:///d:/Tasnim/fitness-tracker/DATABASE_SCHEMA.md)** - MongoDB schema reference
5. **[server/README.md](file:///d:/Tasnim/fitness-tracker/server/README.md)** - Backend API documentation

---

## 🎯 Current Status

| Component | Status | URL |
|-----------|--------|-----|
| Frontend | ✅ Running | http://localhost:5174 |
| Backend | ✅ Running | http://localhost:5000 |
| MongoDB | ⚠️ Not Connected | - |
| Firebase | ⏳ Not Configured | - |
| Stripe | ⏳ Not Configured | - |

---

## 🆘 Troubleshooting

### Server won't start
- Check if port 5000 is already in use
- Make sure all dependencies are installed: `npm install`

### Frontend won't start
- Check if port 5173/5174 is available
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### MongoDB connection failed
- Install MongoDB locally OR use MongoDB Atlas
- Check connection string in `.env`
- Ensure MongoDB service is running

---

## 💡 Tips

1. **Use two terminals** - One for frontend, one for backend
2. **Check logs** - Both servers show helpful error messages
3. **Test API** - Use the `/health` endpoint to verify server is running
4. **Read docs** - All documentation is in the project folder

---

**You're all set! 🚀 Start building your fitness tracker!**

Need help? Check the documentation or ask for assistance with specific features.
