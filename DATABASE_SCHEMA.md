# Fitness Tracker - Database Schema Documentation

## 📊 MongoDB Collections Overview

This document outlines the complete database schema for the Fitness Tracker application using MongoDB.

---

## 🗄️ Collections

### 1. Users Collection

Stores all user accounts with their basic information and role.

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  firebaseUid: "firebase_unique_id_123",
  email: "john.doe@example.com",
  name: "John Doe",
  photoURL: "https://example.com/photos/john.jpg",
  phone: "+1234567890",
  role: "member", // 'member', 'trainer', 'admin'
  isActive: true,
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-20T14:25:00Z")
}
```

**Indexes:**
- `firebaseUid` (unique)
- `email` (unique)
- `role`

---

### 2. Trainers Collection

Extended profile information for users with trainer role.

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  userId: ObjectId("507f1f77bcf86cd799439011"), // Reference to Users
  bio: "Certified fitness trainer with 10 years of experience...",
  experience: 10, // years
  skills: [
    "Yoga",
    "Weight Training",
    "Cardio",
    "Nutrition Coaching"
  ],
  certifications: [
    "ACE Certified Personal Trainer",
    "NASM Nutrition Coach"
  ],
  socialLinks: {
    facebook: "https://facebook.com/johndoe",
    instagram: "https://instagram.com/johndoe",
    twitter: "https://twitter.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe"
  },
  rating: 4.8, // Average rating from reviews
  totalReviews: 45,
  totalBookings: 120,
  isApproved: true,
  approvedAt: ISODate("2024-01-10T09:00:00Z"),
  approvedBy: ObjectId("507f1f77bcf86cd799439099"), // Admin user ID
  createdAt: ISODate("2024-01-08T10:30:00Z"),
  updatedAt: ISODate("2024-01-20T14:25:00Z")
}
```

**Indexes:**
- `userId` (unique)
- `isApproved`
- `rating`

---

### 3. Classes Collection

Fitness class categories available on the platform.

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439013"),
  name: "High-Intensity Interval Training (HIIT)",
  description: "Fast-paced workout combining cardio and strength training...",
  duration: 45, // minutes
  difficulty: "intermediate", // 'beginner', 'intermediate', 'advanced'
  imageURL: "https://example.com/images/hiit-class.jpg",
  benefits: [
    "Burns calories quickly",
    "Improves cardiovascular health",
    "Builds muscle strength"
  ],
  trainers: [
    ObjectId("507f1f77bcf86cd799439012"),
    ObjectId("507f1f77bcf86cd799439014")
  ], // References to Trainers
  bookingCount: 350, // Total bookings for this class
  isActive: true,
  createdAt: ISODate("2024-01-01T10:00:00Z"),
  updatedAt: ISODate("2024-01-20T14:25:00Z")
}
```

**Indexes:**
- `bookingCount` (descending - for top classes)
- `difficulty`
- `isActive`

---

### 4. Slots Collection

Available time slots created by trainers.

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439014"),
  trainerId: ObjectId("507f1f77bcf86cd799439012"),
  classId: ObjectId("507f1f77bcf86cd799439013"),
  className: "High-Intensity Interval Training (HIIT)",
  date: ISODate("2024-02-15T00:00:00Z"),
  startTime: "09:00",
  endTime: "10:00",
  duration: 60, // minutes
  capacity: 5, // Maximum bookings for this slot
  bookedCount: 3, // Current bookings
  isBooked: false, // true when capacity is reached
  status: "available", // 'available', 'booked', 'cancelled', 'completed'
  isRecurring: false,
  recurringPattern: null, // 'daily', 'weekly', 'monthly' if recurring
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-20T14:25:00Z")
}
```

**Indexes:**
- `trainerId`
- `date`
- `status`
- Compound: `trainerId` + `date` + `startTime` (for conflict checking)

---

### 5. Bookings Collection

Records of member bookings with trainers.

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439015"),
  memberId: ObjectId("507f1f77bcf86cd799439020"),
  trainerId: ObjectId("507f1f77bcf86cd799439012"),
  slotId: ObjectId("507f1f77bcf86cd799439014"),
  packageType: "standard", // 'basic', 'standard', 'premium'
  packageDetails: {
    name: "Standard Package",
    price: 50,
    sessions: 20,
    features: [
      "20 training sessions",
      "Nutrition guide",
      "Progress tracking"
    ]
  },
  amount: 50.00,
  paymentStatus: "completed", // 'pending', 'completed', 'failed', 'refunded'
  stripePaymentId: "pi_1234567890abcdef",
  bookingDate: ISODate("2024-02-15T09:00:00Z"),
  status: "upcoming", // 'upcoming', 'completed', 'cancelled', 'no-show'
  hasReview: false,
  cancellationReason: null,
  cancelledAt: null,
  completedAt: null,
  createdAt: ISODate("2024-01-20T10:30:00Z"),
  updatedAt: ISODate("2024-01-20T14:25:00Z")
}
```

**Indexes:**
- `memberId`
- `trainerId`
- `slotId`
- `status`
- `bookingDate`

---

### 6. Reviews Collection

Member reviews for completed training sessions.

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439016"),
  bookingId: ObjectId("507f1f77bcf86cd799439015"),
  memberId: ObjectId("507f1f77bcf86cd799439020"),
  trainerId: ObjectId("507f1f77bcf86cd799439012"),
  rating: 5, // 1-5 stars
  comment: "Excellent trainer! Very motivating and knowledgeable.",
  isPublic: true, // Whether to display publicly
  trainerResponse: null, // Trainer can respond to reviews
  respondedAt: null,
  createdAt: ISODate("2024-02-16T10:30:00Z"),
  updatedAt: ISODate("2024-02-16T10:30:00Z")
}
```

**Indexes:**
- `trainerId`
- `memberId`
- `bookingId` (unique)
- `rating`

---

### 7. ForumPosts Collection

Community forum posts with voting system.

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439017"),
  authorId: ObjectId("507f1f77bcf86cd799439012"),
  authorName: "John Doe",
  authorRole: "trainer", // 'member', 'trainer', 'admin'
  authorPhoto: "https://example.com/photos/john.jpg",
  title: "5 Tips for Better Morning Workouts",
  content: "Here are my top tips for maximizing your morning training...",
  imageURL: "https://example.com/images/morning-workout.jpg",
  category: "Tips & Advice", // 'Tips & Advice', 'Success Stories', 'Questions', 'General'
  upVotes: 45,
  downVotes: 2,
  votedBy: [
    {
      userId: ObjectId("507f1f77bcf86cd799439020"),
      voteType: "up", // 'up' or 'down'
      votedAt: ISODate("2024-01-21T10:30:00Z")
    }
  ],
  comments: [
    {
      _id: ObjectId("507f1f77bcf86cd799439018"),
      userId: ObjectId("507f1f77bcf86cd799439021"),
      userName: "Jane Smith",
      userPhoto: "https://example.com/photos/jane.jpg",
      text: "Great tips! I'll try these tomorrow.",
      createdAt: ISODate("2024-01-21T11:00:00Z")
    }
  ],
  views: 320,
  isPinned: false,
  isLocked: false,
  createdAt: ISODate("2024-01-20T10:30:00Z"),
  updatedAt: ISODate("2024-01-21T14:25:00Z")
}
```

**Indexes:**
- `authorId`
- `category`
- `createdAt` (descending - for newest first)
- `upVotes` (descending - for most voted)
- `isPinned`

---

### 8. TrainerApplications Collection

Applications from members wanting to become trainers.

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439019"),
  userId: ObjectId("507f1f77bcf86cd799439022"),
  fullName: "Mike Johnson",
  email: "mike.johnson@example.com",
  phone: "+1234567890",
  photoURL: "https://example.com/photos/mike.jpg",
  experience: 5, // years
  skills: [
    "CrossFit",
    "Olympic Weightlifting",
    "Sports Nutrition"
  ],
  certifications: [
    "CrossFit Level 2 Trainer",
    "USA Weightlifting Sports Performance Coach"
  ],
  bio: "Passionate about helping people achieve their fitness goals...",
  availableSlots: [
    "Monday 6-8 AM",
    "Wednesday 6-8 AM",
    "Friday 6-8 AM"
  ],
  socialLinks: {
    facebook: "https://facebook.com/mikejohnson",
    instagram: "https://instagram.com/mikejohnson"
  },
  certificationDocuments: [
    "https://example.com/docs/cert1.pdf",
    "https://example.com/docs/cert2.pdf"
  ],
  status: "pending", // 'pending', 'approved', 'rejected'
  adminFeedback: null,
  reviewedBy: null, // Admin user ID
  appliedAt: ISODate("2024-01-18T10:30:00Z"),
  reviewedAt: null,
  createdAt: ISODate("2024-01-18T10:30:00Z"),
  updatedAt: ISODate("2024-01-18T10:30:00Z")
}
```

**Indexes:**
- `userId`
- `status`
- `appliedAt` (descending)

---

### 9. NewsletterSubscribers Collection

Email addresses subscribed to the newsletter.

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439020"),
  email: "subscriber@example.com",
  name: "Sarah Williams", // Optional
  source: "homepage", // 'homepage', 'footer', 'popup'
  isActive: true,
  subscribedAt: ISODate("2024-01-15T10:30:00Z"),
  unsubscribedAt: null,
  lastEmailSent: ISODate("2024-01-20T09:00:00Z")
}
```

**Indexes:**
- `email` (unique)
- `isActive`

---

### 10. Transactions Collection

Financial transaction records for all payments.

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439021"),
  bookingId: ObjectId("507f1f77bcf86cd799439015"),
  memberId: ObjectId("507f1f77bcf86cd799439020"),
  memberName: "Alice Brown",
  memberEmail: "alice@example.com",
  trainerId: ObjectId("507f1f77bcf86cd799439012"),
  trainerName: "John Doe",
  amount: 50.00,
  currency: "USD",
  packageType: "standard",
  stripePaymentId: "pi_1234567890abcdef",
  stripePaymentIntentId: "pi_1234567890abcdef",
  status: "success", // 'pending', 'success', 'failed', 'refunded'
  paymentMethod: "card",
  cardLast4: "4242",
  cardBrand: "visa",
  refundAmount: 0,
  refundReason: null,
  refundedAt: null,
  metadata: {
    slotDate: "2024-02-15",
    slotTime: "09:00-10:00"
  },
  createdAt: ISODate("2024-01-20T10:30:00Z"),
  updatedAt: ISODate("2024-01-20T10:30:00Z")
}
```

**Indexes:**
- `memberId`
- `trainerId`
- `bookingId`
- `status`
- `createdAt` (descending - for recent transactions)
- `stripePaymentId` (unique)

---

## 🔗 Relationships

### One-to-One
- **Users ↔ Trainers**: One user can have one trainer profile
- **Bookings ↔ Reviews**: One booking can have one review

### One-to-Many
- **Users → Bookings**: One user can have many bookings
- **Trainers → Slots**: One trainer can create many slots
- **Trainers → Bookings**: One trainer can have many bookings
- **Users → TrainerApplications**: One user can submit multiple applications
- **Users → ForumPosts**: One user can create many posts
- **Trainers → Reviews**: One trainer can receive many reviews

### Many-to-Many
- **Classes ↔ Trainers**: Many classes can have many trainers

---

## 📈 Aggregation Queries

### Top 6 Most Booked Classes

```javascript
db.classes.aggregate([
  { $match: { isActive: true } },
  { $sort: { bookingCount: -1 } },
  { $limit: 6 },
  {
    $lookup: {
      from: "trainers",
      localField: "trainers",
      foreignField: "_id",
      as: "trainerDetails"
    }
  }
])
```

### Trainer Statistics

```javascript
db.trainers.aggregate([
  { $match: { _id: trainerId } },
  {
    $lookup: {
      from: "bookings",
      localField: "_id",
      foreignField: "trainerId",
      as: "bookings"
    }
  },
  {
    $lookup: {
      from: "reviews",
      localField: "_id",
      foreignField: "trainerId",
      as: "reviews"
    }
  },
  {
    $project: {
      totalBookings: { $size: "$bookings" },
      totalReviews: { $size: "$reviews" },
      averageRating: { $avg: "$reviews.rating" },
      totalEarnings: { $sum: "$bookings.amount" }
    }
  }
])
```

### Monthly Revenue

```javascript
db.transactions.aggregate([
  { $match: { status: "success" } },
  {
    $group: {
      _id: {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" }
      },
      totalRevenue: { $sum: "$amount" },
      transactionCount: { $sum: 1 }
    }
  },
  { $sort: { "_id.year": -1, "_id.month": -1 } }
])
```

### Package Distribution

```javascript
db.bookings.aggregate([
  { $match: { paymentStatus: "completed" } },
  {
    $group: {
      _id: "$packageType",
      count: { $sum: 1 },
      totalRevenue: { $sum: "$amount" }
    }
  }
])
```

---

## 🔒 Data Validation Rules

### User Email Validation
```javascript
{
  validator: {
    $jsonSchema: {
      required: ["email", "firebaseUid", "name", "role"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        role: {
          enum: ["member", "trainer", "admin"]
        }
      }
    }
  }
}
```

### Booking Amount Validation
```javascript
{
  validator: {
    $jsonSchema: {
      required: ["memberId", "trainerId", "slotId", "amount"],
      properties: {
        amount: {
          bsonType: "double",
          minimum: 0
        },
        packageType: {
          enum: ["basic", "standard", "premium"]
        }
      }
    }
  }
}
```

---

## 🎯 Sample Data for Testing

### Sample Admin User
```javascript
{
  firebaseUid: "admin_firebase_uid",
  email: "admin@fitnesstracker.com",
  name: "Admin User",
  role: "admin",
  isActive: true
}
```

### Sample Trainer
```javascript
{
  firebaseUid: "trainer_firebase_uid",
  email: "trainer@example.com",
  name: "John Trainer",
  role: "trainer",
  isActive: true
}
```

### Sample Member
```javascript
{
  firebaseUid: "member_firebase_uid",
  email: "member@example.com",
  name: "Jane Member",
  role: "member",
  isActive: true
}
```

---

## 📝 Migration Scripts

### Initialize Collections
```javascript
// Create collections with validation
db.createCollection("users", { /* validation rules */ });
db.createCollection("trainers", { /* validation rules */ });
db.createCollection("classes", { /* validation rules */ });
// ... etc
```

### Create Indexes
```javascript
// Users indexes
db.users.createIndex({ "firebaseUid": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });

// Trainers indexes
db.trainers.createIndex({ "userId": 1 }, { unique: true });
db.trainers.createIndex({ "isApproved": 1 });
db.trainers.createIndex({ "rating": -1 });

// Classes indexes
db.classes.createIndex({ "bookingCount": -1 });
db.classes.createIndex({ "difficulty": 1 });

// ... etc
```

---

## 🔄 Backup & Restore

### Backup Command
```bash
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/fitness-tracker" --out=/backup/
```

### Restore Command
```bash
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/fitness-tracker" /backup/fitness-tracker/
```

---

**Database Schema Version**: 1.0  
**Last Updated**: January 2024  
**MongoDB Version**: 6.0+
