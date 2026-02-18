# � Lock and Load Fries - Complete Food Ordering System

A full-stack food ordering application with customer website, admin portal, and Firebase backend.

## Features

### Customer App
- User authentication (Email + Phone OTP)
- Browse menu by categories (Beverages, Burgers, Loaded Fries)
- Veg/Non-veg filter
- Add to cart functionality
- Secure checkout
- Multiple payment methods (COD & PhonePe UPI)
- Order confirmation with email/SMS notifications

### Admin Portal
- Secure admin login
- Real-time order management
- Order status updates (Pending → Preparing → Ready → Completed)
- Menu item management (Add, Edit, Delete)
- Toggle item availability
- Order statistics dashboard

## Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS
- **Backend:** Firebase (Firestore, Authentication)
- **Payment:** PhonePe Payment Gateway
- **Notifications:** Firebase Email Extension, Twilio SMS

## Project Structure

```
campus-bites/
├── customer-app/          # Customer Website (Port 3000)
├── admin-app/             # Admin Portal (Port 3001)
├── firebase/              # Firebase Configuration
└── README.md
```

## Quick Start

### Prerequisites
- Node.js v18+
- Firebase Account
- Twilio Account (for SMS)

### Installation

1. **Clone and install dependencies:**
```bash
cd campus-bites/customer-app
npm install

cd ../admin-app
npm install
```

2. **Configure environment variables:**

Copy `.env.local.example` to `.env.local` in both apps and fill in your credentials.

3. **Run development servers:**

```bash
# Terminal 1 - Customer App
cd customer-app
npm run dev

# Terminal 2 - Admin App
cd admin-app
npm run dev
```

4. **Access the apps:**
- Customer Site: http://localhost:3000
- Admin Portal: http://localhost:3001

## Admin Credentials (Default)
- Email: admin@campusbites.com
- Password: Admin@123

## Firestore Collections

- `users` - User profiles
- `menuItems` - Menu items with categories
- `orders` - Customer orders
- `mail` - Email queue (for Firebase Email Extension)

## Deployment

See the full documentation for deployment instructions including:
- Server setup (VPS/Cloud)
- PM2 process management
- Nginx configuration
- SSL certificates

## License

MIT License - Feel free to use for your own projects!
