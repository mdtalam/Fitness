# 🏋️ Fitness Tracker - Full-Stack Application

## 📋 Project Overview

A comprehensive **Fitness Tracker** web application that empowers users to explore fitness classes, book sessions with professional trainers, and manage their fitness journey. The platform supports three distinct user roles with specialized dashboards and features.

### 🎯 Core Objectives
- Enable members to discover and book fitness trainers
- Provide trainers with tools to manage their schedules and engage with the community
- Give admins complete control over platform management and analytics

---

## 👥 User Roles & Permissions

### 🔵 Member (Default Role)
- Browse all public pages without authentication
- Book training sessions with available trainers
- Apply to become a trainer
- Track booking history and application status
- Manage personal profile
- Submit reviews for completed sessions

### 🟢 Trainer
- All Member privileges
- Manage available time slots
- View booking details for their slots
- Create and manage forum posts
- Contribute to community discussions

### 🔴 Admin
- Manage trainer applications (approve/reject with feedback)
- Add new fitness classes to the platform
- Monitor all trainers and manage their roles
- Track financial activities (total balance, transactions)
- Manage newsletter subscribers
- Full platform oversight

---

## 🚀 Technology Stack

### Frontend
- **Framework**: React.js 18+
- **Styling**: Tailwind CSS with component libraries (DaisyUI/Flowbite/Material Tailwind)
- **State Management**: Tanstack Query (React Query) for server state
- **Routing**: React Router v6
- **Form Handling**: React Hook Form
- **Date/Time**: React DatePicker
- **Select Components**: React Select
- **Notifications**: React Hot Toast / SweetAlert2
- **Icons**: React Icons
- **Animations**: Framer Motion (optional)

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Firebase Auth (Email/Password + Social Login)
- **Authorization**: JWT (JSON Web Tokens)
- **Payment Processing**: Stripe API
- **Environment Management**: dotenv

### DevOps & Tools
- **Version Control**: Git (minimum 20 commits for client, 12 for server)
- **Package Manager**: npm/yarn
- **Build Tool**: Vite
- **Code Quality**: ESLint, Prettier

---

## 📱 Application Features

### Public Pages (No Authentication Required)

#### 🏠 Homepage
1. **Banner Slider** - Dynamic carousel showcasing key features
2. **Featured Features** - 6 cards highlighting platform capabilities
3. **About Us Section** - Company mission and vision
4. **Featured Classes** - Top 6 most booked classes (sorted by booking count)
5. **Testimonials** - Carousel of user reviews and success stories
6. **Latest Community Posts** - Recent forum discussions
7. **Newsletter Subscription** - Email collection for updates
8. **Team Section** - Meet the team behind the platform

#### 👨‍🏫 All Trainers Page
- Grid/card layout displaying all approved trainers
- Each card shows:
  - Trainer photo and name
  - Years of experience
  - Specialization/skills
  - Available time slots count
  - "Know More" button linking to trainer details

#### 🔍 Trainer Details Page
- Comprehensive trainer profile
- Full bio and credentials
- Skills and specializations
- Available time slots with booking options
- Social media links
- Reviews and ratings

#### 📚 Classes Page
- Paginated list (6 classes per page)
- Each class card displays:
  - Class name and description
  - Duration and difficulty level
  - List of trainers specializing in this class
  - Class image/icon

#### 💬 Forum/Community Page
- Public forum posts visible to all
- Voting system (up-vote/down-vote)
- Author badges (Admin/Trainer/Member)
- Post creation requires authentication
- Sorting options (newest, most voted, trending)

### Private Pages (Authentication Required)

#### 🎫 Trainer Booking Flow
**Multi-step booking process:**

1. **Step 1: Select Slot**
   - Choose from trainer's available time slots
   - View slot details (date, time, duration)

2. **Step 2: Choose Package**
   - **Basic**: $10/month - 5 sessions
   - **Standard**: $50/month - 20 sessions + nutrition guide
   - **Premium**: $100/month - Unlimited sessions + personalized plan

3. **Step 3: Payment**
   - Stripe integration for secure payment
   - Support for credit/debit cards
   - Payment confirmation and receipt

4. **Step 4: Confirmation**
   - Booking summary
   - Email confirmation
   - Add to calendar option

#### 📝 Be a Trainer Application
- Application form with fields:
  - Full name, email, phone
  - Profile photo upload
  - Years of experience
  - Skills/specializations (multi-select)
  - Certifications
  - Bio/description
  - Available time slots
  - Social media links
- Application status tracking
- Admin review and feedback system

---

## 🎛️ Dashboard Features

### 👤 Member Dashboard

#### Activity Log
- View trainer application status
- Track application progress
- View admin feedback on applications

#### Profile Settings
- Update personal information
- Change password (Firebase)
- Upload/update profile photo
- Manage notification preferences

#### Booked Trainers
- List of all bookings (past and upcoming)
- Booking details (trainer, date, time, package)
- Cancel upcoming bookings
- **Submit Reviews**: Rate and review completed sessions

---

### 🏋️ Trainer Dashboard

#### Manage Slots
- View all created time slots
- See booking status for each slot
- Delete available slots
- View member details for booked slots

#### Add New Slot
- Create new available time slots
- Use React Select for time selection
- Set slot duration and capacity
- Recurring slot options

#### Add Forum Post
- Create new community posts
- Rich text editor for formatting
- Add images/media
- Category/tag selection

#### Manage Forum
- Edit/delete own posts
- View post analytics (views, votes)
- Respond to comments

---

### 👑 Admin Dashboard

#### All Subscribers
- View newsletter subscriber list
- Export subscriber data
- Send bulk emails (bonus feature)

#### All Trainers
- View all approved trainers
- Remove trainer role (demote to member)
- View trainer statistics
- Search and filter trainers

#### Applied Trainers
- Review pending applications
- **Approve** applications (promote to trainer role)
- **Reject** applications with feedback message
- View application details and credentials

#### Balance & Transactions
- **Total Balance**: Sum of all successful payments
- **Transaction History**: Detailed payment records
- **Charts/Graphs**: Visual representation of revenue
  - Monthly revenue trends
  - Package distribution
  - Top trainers by bookings

#### Add New Class
- Create new fitness class categories
- Upload class images
- Set class descriptions
- Assign difficulty levels

---

## 🗄️ Database Schema (MongoDB)

### Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  firebaseUid: String,
  email: String,
  name: String,
  photoURL: String,
  role: String, // 'member', 'trainer', 'admin'
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Trainers Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to Users
  bio: String,
  experience: Number, // years
  skills: [String],
  certifications: [String],
  socialLinks: {
    facebook: String,
    instagram: String,
    twitter: String
  },
  rating: Number,
  totalBookings: Number,
  isApproved: Boolean,
  createdAt: Date
}
```

#### Classes Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  duration: Number, // minutes
  difficulty: String, // 'beginner', 'intermediate', 'advanced'
  imageURL: String,
  trainers: [ObjectId], // References to Trainers
  bookingCount: Number, // For sorting top classes
  createdAt: Date
}
```

#### Slots Collection
```javascript
{
  _id: ObjectId,
  trainerId: ObjectId,
  className: String,
  date: Date,
  startTime: String,
  endTime: String,
  duration: Number,
  capacity: Number,
  bookedCount: Number,
  isBooked: Boolean,
  createdAt: Date
}
```

#### Bookings Collection
```javascript
{
  _id: ObjectId,
  memberId: ObjectId,
  trainerId: ObjectId,
  slotId: ObjectId,
  packageType: String, // 'basic', 'standard', 'premium'
  amount: Number,
  paymentStatus: String, // 'pending', 'completed', 'failed'
  stripePaymentId: String,
  bookingDate: Date,
  status: String, // 'upcoming', 'completed', 'cancelled'
  hasReview: Boolean,
  createdAt: Date
}
```

#### Reviews Collection
```javascript
{
  _id: ObjectId,
  bookingId: ObjectId,
  memberId: ObjectId,
  trainerId: ObjectId,
  rating: Number, // 1-5
  comment: String,
  createdAt: Date
}
```

#### Forum Posts Collection
```javascript
{
  _id: ObjectId,
  authorId: ObjectId,
  authorRole: String,
  title: String,
  content: String,
  imageURL: String,
  upVotes: Number,
  downVotes: Number,
  votedBy: [{
    userId: ObjectId,
    voteType: String // 'up' or 'down'
  }],
  comments: [{
    userId: ObjectId,
    text: String,
    createdAt: Date
  }],
  createdAt: Date
}
```

#### Trainer Applications Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  fullName: String,
  email: String,
  phone: String,
  photoURL: String,
  experience: Number,
  skills: [String],
  certifications: [String],
  bio: String,
  availableSlots: [String],
  socialLinks: Object,
  status: String, // 'pending', 'approved', 'rejected'
  adminFeedback: String,
  appliedAt: Date,
  reviewedAt: Date
}
```

#### Newsletter Subscribers Collection
```javascript
{
  _id: ObjectId,
  email: String,
  subscribedAt: Date,
  isActive: Boolean
}
```

#### Transactions Collection
```javascript
{
  _id: ObjectId,
  bookingId: ObjectId,
  memberId: ObjectId,
  trainerId: ObjectId,
  amount: Number,
  packageType: String,
  stripePaymentId: String,
  status: String, // 'success', 'failed', 'refunded'
  createdAt: Date
}
```

---

## 🔐 Authentication & Authorization

### Firebase Authentication
- **Email/Password**: Traditional signup and login
- **Social Login**: Google, Facebook, GitHub
- **Password Reset**: Email-based recovery
- **Email Verification**: Confirm user emails

### JWT Implementation
- **Token Generation**: Server-side after Firebase verification
- **Token Storage**: localStorage (client-side)
- **Token Validation**: Middleware on protected routes
- **Token Expiration**: 7 days (configurable)
- **Refresh Mechanism**: Auto-refresh before expiration

### Protected Routes
- Client-side route guards using React Router
- Server-side middleware for API endpoints
- Role-based access control (RBAC)

---

## 💳 Payment Integration (Stripe)

### Setup
1. Create Stripe account and get API keys
2. Install Stripe SDK: `npm install stripe @stripe/stripe-js @stripe/react-stripe-js`
3. Configure environment variables

### Implementation
- **Client-side**: Stripe Elements for card input
- **Server-side**: Create payment intents
- **Webhooks**: Handle payment confirmations
- **Security**: Never expose secret keys to client

### Payment Flow
1. User selects package and slot
2. Client creates payment intent on server
3. Stripe Elements collects card details
4. Payment confirmation and booking creation
5. Email receipt to user

---

## 📦 Implementation Plan

### Phase 1: Project Setup & Authentication (Week 1)
- [ ] Initialize React project with Vite
- [ ] Set up Tailwind CSS and component library
- [ ] Configure Firebase project
- [ ] Set up MongoDB database
- [ ] Create Express.js server
- [ ] Implement Firebase authentication
- [ ] Create JWT middleware
- [ ] Build Login/Register pages
- [ ] Set up protected routes

### Phase 2: Public Pages (Week 2)
- [ ] Design and implement Homepage
  - [ ] Banner slider component
  - [ ] Featured features section
  - [ ] About Us section
  - [ ] Top classes section (with MongoDB $sort)
  - [ ] Testimonials carousel
  - [ ] Newsletter subscription
  - [ ] Team section
- [ ] Create All Trainers page
- [ ] Build Trainer Details page
- [ ] Implement Classes page with pagination
- [ ] Develop Forum/Community page with voting

### Phase 3: Booking System (Week 3)
- [ ] Create multi-step booking form
- [ ] Integrate Stripe payment
- [ ] Build booking confirmation flow
- [ ] Implement booking management
- [ ] Create email notifications
- [ ] Add booking cancellation feature

### Phase 4: Trainer Application System (Week 3-4)
- [ ] Build "Be a Trainer" application form
- [ ] Create application submission API
- [ ] Implement file upload for photos/certificates
- [ ] Build admin review interface
- [ ] Create approval/rejection workflow
- [ ] Add email notifications for status updates

### Phase 5: Member Dashboard (Week 4)
- [ ] Create dashboard layout with side navigation
- [ ] Build Activity Log component
- [ ] Implement Profile Settings page
- [ ] Create Booked Trainers list
- [ ] Add review submission form
- [ ] Implement booking cancellation

### Phase 6: Trainer Dashboard (Week 5)
- [ ] Build Manage Slots interface
- [ ] Create Add New Slot form with React Select
- [ ] Implement slot deletion
- [ ] Build Add Forum Post editor
- [ ] Create post management interface
- [ ] Add analytics for trainer posts

### Phase 7: Admin Dashboard (Week 5-6)
- [ ] Create All Subscribers page
- [ ] Build All Trainers management
- [ ] Implement Applied Trainers review system
- [ ] Create Balance & Transactions page
- [ ] Add charts for financial data
- [ ] Build Add New Class form
- [ ] Implement trainer role management

### Phase 8: Testing & Optimization (Week 6)
- [ ] Test all user flows
- [ ] Verify role-based access control
- [ ] Test payment integration thoroughly
- [ ] Optimize database queries
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Ensure responsive design
- [ ] Cross-browser testing

### Phase 9: Deployment & Documentation (Week 7)
- [ ] Deploy backend to hosting service
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Configure environment variables
- [ ] Set up MongoDB Atlas
- [ ] Create deployment documentation
- [ ] Write API documentation
- [ ] Create user guide

---

## 🎨 Design Requirements

### Responsive Design
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px and above

### UI/UX Principles
- Clean and modern interface
- Consistent color scheme
- Intuitive navigation
- Fast loading times
- Accessible design (WCAG 2.1)
- Smooth animations and transitions

### Dynamic Page Titles
- Update `document.title` based on current route
- Format: "Page Name - Fitness Tracker"

---

## 🔒 Security Best Practices

1. **Environment Variables**: Store all sensitive keys in `.env` files
2. **Input Validation**: Validate all user inputs on client and server
3. **SQL Injection Prevention**: Use Mongoose parameterized queries
4. **XSS Protection**: Sanitize user-generated content
5. **CORS Configuration**: Restrict API access to trusted origins
6. **Rate Limiting**: Prevent API abuse
7. **HTTPS**: Use SSL certificates in production
8. **Password Security**: Firebase handles password hashing
9. **JWT Security**: Short expiration times, secure storage

---

## 📊 Bonus Features

### Advanced Analytics
- User engagement metrics
- Trainer performance dashboard
- Revenue forecasting
- Popular class trends

### Social Features
- User profiles with activity feed
- Follow trainers
- Share achievements on social media
- In-app messaging between members and trainers

### Gamification
- Achievement badges
- Streak tracking
- Leaderboards
- Progress milestones

### Mobile App
- React Native version
- Push notifications
- Offline mode
- Wearable device integration

---

## 🚦 Getting Started

### Prerequisites
```bash
Node.js >= 18.0.0
npm >= 9.0.0
MongoDB >= 6.0
Git
```

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd fitness-tracker
```

2. **Install client dependencies**
```bash
npm install
```

3. **Install server dependencies**
```bash
cd server
npm install
```

4. **Configure environment variables**

Create `.env` in root directory:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_API_URL=http://localhost:5000
```

Create `.env` in server directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
FIREBASE_ADMIN_SDK=path_to_firebase_admin_sdk.json
CLIENT_URL=http://localhost:5173
```

5. **Run the application**

Terminal 1 (Client):
```bash
npm run dev
```

Terminal 2 (Server):
```bash
cd server
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-token` - Verify JWT token
- `POST /api/auth/refresh` - Refresh JWT token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get user by ID

### Trainers
- `GET /api/trainers` - Get all trainers
- `GET /api/trainers/:id` - Get trainer details
- `POST /api/trainers/apply` - Submit trainer application
- `GET /api/trainers/applications` - Get user's applications

### Classes
- `GET /api/classes` - Get all classes (with pagination)
- `GET /api/classes/:id` - Get class details
- `POST /api/classes` - Create new class (Admin only)
- `GET /api/classes/top` - Get top 6 most booked classes

### Slots
- `GET /api/slots/trainer/:trainerId` - Get trainer's slots
- `POST /api/slots` - Create new slot (Trainer only)
- `DELETE /api/slots/:id` - Delete slot (Trainer only)
- `GET /api/slots/:id/bookings` - Get slot bookings

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/user` - Get user's bookings
- `GET /api/bookings/trainer` - Get trainer's bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `POST /api/bookings/:id/review` - Submit review

### Forum
- `GET /api/forum/posts` - Get all posts
- `GET /api/forum/posts/:id` - Get post details
- `POST /api/forum/posts` - Create new post
- `PUT /api/forum/posts/:id` - Update post
- `DELETE /api/forum/posts/:id` - Delete post
- `POST /api/forum/posts/:id/vote` - Vote on post

### Admin
- `GET /api/admin/applications` - Get pending applications
- `PUT /api/admin/applications/:id/approve` - Approve application
- `PUT /api/admin/applications/:id/reject` - Reject application
- `GET /api/admin/trainers` - Get all trainers
- `DELETE /api/admin/trainers/:id` - Remove trainer role
- `GET /api/admin/transactions` - Get all transactions
- `GET /api/admin/subscribers` - Get newsletter subscribers

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `DELETE /api/newsletter/unsubscribe` - Unsubscribe

### Payment
- `POST /api/payment/create-intent` - Create Stripe payment intent
- `POST /api/payment/webhook` - Stripe webhook handler

---

## 🧪 Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- API endpoint testing with Jest/Supertest
- Utility function testing

### Integration Tests
- User authentication flow
- Booking process end-to-end
- Payment integration
- Role-based access control

### E2E Tests
- Critical user journeys
- Cross-browser compatibility
- Mobile responsiveness

---

## 📈 Performance Optimization

1. **Code Splitting**: Lazy load routes and components
2. **Image Optimization**: Use WebP format, lazy loading
3. **Caching**: Implement React Query caching strategies
4. **Database Indexing**: Index frequently queried fields
5. **CDN**: Serve static assets from CDN
6. **Minification**: Compress CSS/JS in production
7. **Server-Side Rendering**: Consider Next.js for SEO

---

## 🤝 Contributing

### Commit Guidelines
- Minimum 20 commits for client-side
- Minimum 12 commits for server-side
- Use conventional commit messages:
  - `feat:` New feature
  - `fix:` Bug fix
  - `docs:` Documentation
  - `style:` Formatting
  - `refactor:` Code restructuring
  - `test:` Testing
  - `chore:` Maintenance

### Code Style
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

---

## 📚 Resources & Documentation

### Official Documentation
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/docs/)
- [Firebase](https://firebase.google.com/docs)
- [Stripe](https://stripe.com/docs)
- [Tanstack Query](https://tanstack.com/query)

### Tutorials & Guides
- Firebase Authentication with React
- Stripe Payment Integration
- MongoDB Schema Design
- JWT Authentication Best Practices

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: Firebase authentication not working
- **Solution**: Check API keys in `.env` file, verify Firebase project configuration

**Issue**: MongoDB connection failed
- **Solution**: Verify MongoDB URI, check network access in MongoDB Atlas

**Issue**: Stripe payment failing
- **Solution**: Ensure Stripe keys are correct, check webhook configuration

**Issue**: JWT token expired
- **Solution**: Implement token refresh mechanism, check token expiration time

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Firebase for authentication services
- Stripe for payment processing
- MongoDB for database solutions
- React community for amazing libraries
- All contributors and testers

---

## 📞 Support

For support, email support@fitnesstracker.com or join our Slack channel.

---

**Built with ❤️ for fitness enthusiasts worldwide**
