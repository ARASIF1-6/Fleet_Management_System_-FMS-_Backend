# Fleet Management System (FMS) 🚕

A comprehensive fleet management solution built with Node.js and PostgreSQL, designed to streamline taxi operations and driver management.

## 🌟 Key Features

### Document Management
- Digital storage for driver documents
- Automatic expiry notifications
- Document verification system

### Vehicle Monitoring
- Daily vehicle inspection checklists
- Maintenance tracking
- Historical inspection records

### User Management
- Role-based access control
- Secure authentication with JWT
- Profile management
- Company information tracking

### Payment Integration
- Stripe payment processing
- Subscription management
- Trial period handling

## 🛠️ Technology Stack

| Category | Technologies |
|----------|-------------|
| Backend | Node.js, Express.js |
| Database | PostgreSQL, Prisma ORM |
| Authentication | JWT |
| File Storage | Multer |
| Email Service | Nodemailer |
| Payments | Stripe |
| Development | Nodemon |

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/panthertaxis-fms.git
cd panthertaxis-fms
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file with the following variables:
```env
DATABASE_URL="your_postgresql_url"
PORT=3000
SECRET_CODE="your_secret_code"
IMAGE_UPLOAD_SERVICE_URL="your_image_service_url"
EMAIL_USER="your_email"
EMAIL_PASS="your_email_password"
EMAIL_PORT=465
EMAIL_HOST="smtp.gmail.com"
STRIPE_SECRET_KEY="your_stripe_key"
```

4. **Database Setup**
```bash
npx prisma generate
npx prisma migrate dev
```

5. **Start the Server**
```bash
# Development
npm run dev

# Production
npm start
```

## 🔄 API Endpoints

### Authentication
```
POST /api/auth/register     - Register new user
POST /api/auth/login        - User login
POST /api/auth/verify       - Email verification
```

### Documents
```
POST   /api/documents       - Upload document
GET    /api/documents       - List documents
PUT    /api/documents/:id   - Update document
DELETE /api/documents/:id   - Delete document
```

### Vehicle Checks
```
POST   /api/checks         - Submit daily check
GET    /api/checks         - Get check history
PUT    /api/checks/:id     - Update check
```

## 🔒 Security Features

- CORS protection
- Request rate limiting
- Input validation
- Secure password hashing
- JWT authentication
- File upload restrictions

## 📁 Project Structure

```
src/
├── controllers/      # Request handlers
├── middlewares/      # Custom middleware
├── models/           # Data models
├── routes/           # API routes
├── services/         # Business logic
├── utils/           # Helper functions
└── app.js           # Main application file
```
