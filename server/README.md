# Fitness Tracker - Backend Server

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**
Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

Required environment variables:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `FIREBASE_*` - Firebase Admin SDK credentials
- `STRIPE_SECRET_KEY` - Stripe API key
- `EMAIL_*` - Email configuration for Nodemailer

3. **Start the server**

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

---

## 📁 Project Structure

```
server/
├── controllers/        # Request handlers
│   └── auth.controller.js
├── middleware/         # Custom middleware
│   └── auth.middleware.js
├── models/            # Mongoose models
│   ├── User.model.js
│   ├── Trainer.model.js
│   └── Class.model.js
├── routes/            # API routes
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── trainer.routes.js
│   ├── class.routes.js
│   ├── slot.routes.js
│   ├── booking.routes.js
│   ├── forum.routes.js
│   ├── admin.routes.js
│   ├── newsletter.routes.js
│   └── payment.routes.js
├── .env               # Environment variables
├── .env.example       # Environment template
├── server.js          # Main server file
└── package.json       # Dependencies
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-token` - Verify JWT token
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile (Protected)

### Trainers
- `GET /api/trainers` - Get all trainers

### Classes
- `GET /api/classes` - Get all classes

### Slots
- `GET /api/slots` - Get all slots

### Bookings
- `GET /api/bookings` - Get all bookings

### Forum
- `GET /api/forum/posts` - Get forum posts

### Admin
- `GET /api/admin/applications` - Get trainer applications

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter

### Payment
- `POST /api/payments/create-intent` - Create payment intent

---

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### How to authenticate:

1. Register or login to get a token
2. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

### Protected Routes

Routes that require authentication use the `protect` middleware.

### Role-Based Access

Some routes are restricted to specific roles:
- `member` - Default role
- `trainer` - Can manage slots and create posts
- `admin` - Full access to all features

---

## 🗄️ Database Models

### User
- firebaseUid (unique)
- email (unique)
- name
- photoURL
- phone
- role (member/trainer/admin)
- isActive

### Trainer
- userId (reference to User)
- bio
- experience
- skills
- certifications
- socialLinks
- rating
- totalReviews
- totalBookings
- isApproved

### Class
- name
- description
- duration
- difficulty
- imageURL
- benefits
- trainers (array of references)
- bookingCount
- isActive

---

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:5000/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firebaseUid": "test_firebase_uid",
    "email": "test@example.com",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firebaseUid": "test_firebase_uid"
  }'
```

---

## 📦 Dependencies

### Production
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `dotenv` - Environment variables
- `cors` - CORS middleware
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `firebase-admin` - Firebase Admin SDK
- `stripe` - Payment processing
- `nodemailer` - Email sending
- `express-validator` - Input validation

### Development
- `nodemon` - Auto-reload server

---

## 🔧 Development

### Adding a New Route

1. Create controller in `controllers/`
2. Create route file in `routes/`
3. Import and use in `server.js`

### Adding a New Model

1. Create model file in `models/`
2. Define schema with Mongoose
3. Export the model

---

## 🚀 Deployment

### Environment Variables
Make sure to set all required environment variables in your hosting platform.

### MongoDB Atlas
1. Create a cluster on MongoDB Atlas
2. Get connection string
3. Update `MONGODB_URI` in `.env`

### Hosting Options
- Heroku
- Railway
- Render
- DigitalOcean
- AWS

---

## 📝 Notes

- All routes return JSON responses
- Error handling is centralized
- MongoDB connection is established before starting the server
- CORS is configured to allow requests from the client

---

## 🤝 Contributing

1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

**Server Status**: ✅ Ready for Development
