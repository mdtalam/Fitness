# 🎯 Fitness Tracker: Modern Health & Wellness Platform

[![Production](https://img.shields.io/badge/Production-Live-success?style=for-the-badge)](https://fitness-c3ed3.web.app)
[![API Status](https://img.shields.io/badge/API-Online-blue?style=for-the-badge)](https://fitness-tracker-ten-theta.vercel.app/health)
[![Vite](https://img.shields.io/badge/Frontend-Vite%20+%20React-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Vercel](https://img.shields.io/badge/Backend-Express%20+%20Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

A premium, full-stack fitness management application designed to connect fitness enthusiasts with professional trainers. Built with the **MERN** stack and optimized for high-performance deployment.

---

## 🚀 Live Links

- **Frontend (UI)**: [https://fitness-c3ed3.web.app](https://fitness-c3ed3.web.app)
- **Backend (API)**: [https://fitness-tracker-ten-theta.vercel.app](https://fitness-tracker-ten-theta.vercel.app)

---

## ✨ Key Features

### 👥 Three Specialized User Roles
- **Member**: Browse trainers, book sessions, track progress, and contribute to the community forum.
- **Trainer**: Manage time slots, view booked sessions, and share expert knowledge via forum posts.
- **Admin**: Complete platform oversight, trainer application review, and financial analytics.

### 💳 Premium Features
- **Booking System**: Seamless multi-step booking with Stripe payment integration.
- **Dynamic Dashboards**: Real-time stats and management for all user types.
- **Community Forum**: Engaging space for fitness discussion with voting and commenting.
- **Newsletter**: Stay updated with the latest classes and health tips.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, DaisyUI, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **Auth** | Firebase Authentication + JWT |
| **Payments** | Stripe API |
| **Deployment** | Firebase Hosting (Client) & Vercel (Server) |

---

## 📁 Project Structure (Monorepo)

```text
fitness-tracker/
├── client/              # Frontend Application (Vite + React)
│   ├── src/             # Source code
│   ├── public/          # Static assets
│   └── firebase.json    # Deployment config
└── server/              # Backend API (Express + Node)
    ├── routes/          # API Route definitions
    ├── controllers/     # Business logic
    ├── config/          # Database & tool config
    └── vercel.json      # Deployment config
```

---

## 💻 Local Development

### 1. Clone the repository
```bash
git clone https://github.com/your-username/fitness-tracker.git
cd fitness-tracker
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Setup Environment Variables
Create `.env` files in both `client/` and `server/` directories based on the `.env.example` files provided.

### 4. Run the Project
```bash
# Run both Backend & Frontend
npm run dev:server
npm run dev:client
```

---

## 🛡️ Security & Performance
- **Protected Routes**: Role-based access control on the frontend.
- **Middleware**: JWT verification on all sensitive API endpoints.
- **CORS Configuration**: Restricted to authorized production origins.
- **Image Optimization**: Fast loading assets.


---

### 💪 Built for Results.
Designed with ❤️ by [Tasnim Alam](https://github.com/tasnim-alam)
