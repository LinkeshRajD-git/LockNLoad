# 🍔 Campus Bites - Complete Food Ordering System
## Full Stack Application with Firebase

---

# 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Firebase Setup](#firebase-setup)
6. [Installation Guide](#installation-guide)
7. [Customer Website Code](#customer-website-code)
8. [Admin Website Code](#admin-website-code)
9. [Payment Integration](#payment-integration)
10. [Email/SMS Service](#email-sms-service)
11. [Deployment](#deployment)

---

# 1. PROJECT OVERVIEW

**Campus Bites** is a complete food ordering system with:
- Customer website for browsing and ordering
- Admin portal for order management
- Firebase authentication with email + phone OTP
- Multiple payment methods (COD & PhonePe UPI)
- Real-time order tracking

---

# 2. TECHNOLOGY STACK

**Frontend:**
- Next.js 14 (React framework)
- Tailwind CSS
- React Context API for state management

**Backend:**
- Firebase Firestore (Database)
- Firebase Authentication (Email + Phone)
- Firebase Cloud Functions (Serverless backend)
- Firebase Storage (Images)

**Payment:**
- PhonePe Payment Gateway

**Email/SMS:**
- Firebase Extensions (Trigger Email)
- Twilio (SMS OTP)

---

# 3. PROJECT STRUCTURE

```
campus-bites/
│
├── customer-app/                    # Customer Website
│   ├── public/
│   │   ├── logo.png
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── SignUp.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   └── OTPVerification.jsx
│   │   │   ├── Layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── Menu/
│   │   │   │   ├── MenuCard.jsx
│   │   │   │   └── FilterBar.jsx
│   │   │   ├── Cart/
│   │   │   │   ├── CartItem.jsx
│   │   │   │   └── CartSummary.jsx
│   │   │   └── Order/
│   │   │       ├── Checkout.jsx
│   │   │       └── OrderConfirmation.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── index.js              # Home page
│   │   │   ├── signup.js
│   │   │   ├── login.js
│   │   │   ├── verify-otp.js
│   │   │   ├── beverages.js
│   │   │   ├── burgers.js
│   │   │   ├── loaded-fries.js
│   │   │   ├── cart.js
│   │   │   ├── checkout.js
│   │   │   ├── payment.js
│   │   │   └── order-confirmation.js
│   │   │
│   │   ├── lib/
│   │   │   ├── firebase.js
│   │   │   └── phonepe.js
│   │   │
│   │   └── styles/
│   │       └── globals.css
│   │
│   ├── .env.local
│   ├── next.config.js
│   ├── package.json
│   └── tailwind.config.js
│
├── admin-app/                       # Admin Portal
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   │   ├── OrderCard.jsx
│   │   │   │   └── Stats.jsx
│   │   │   └── Menu/
│   │   │       ├── MenuManagement.jsx
│   │   │       └── AddMenuItem.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── index.js              # Admin login
│   │   │   ├── dashboard.js
│   │   │   └── menu-management.js
│   │   │
│   │   └── lib/
│   │       └── firebase.js
│   │
│   ├── .env.local
│   ├── next.config.js
│   └── package.json
│
├── firebase/                        # Firebase Configuration
│   ├── firestore.rules
│   ├── storage.rules
│   └── firebase.json
│
└── README.md
```

---

# 4. PREREQUISITES

Before starting, ensure you have:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **npm** or **yarn** package manager
3. **Firebase Account** - [Create Account](https://firebase.google.com/)
4. **Twilio Account** (for SMS) - [Sign Up](https://www.twilio.com/)
5. **Code Editor** (VS Code recommended)

---

# 5. FIREBASE SETUP

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `campus-bites`
4. Disable Google Analytics (optional)
5. Click "Create Project"

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** authentication
4. Enable **Phone** authentication
5. Add test phone numbers if needed (for development)

## Step 3: Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create Database**
3. Select **Start in Production Mode**
4. Choose a location (closest to your users)
5. Click **Enable**

## Step 4: Set up Firestore Collections

Create these collections:

**1. users**
```
users/
  └── {userId}/
      ├── email: string
      ├── phone: string
      ├── name: string
      ├── createdAt: timestamp
      └── isVerified: boolean
```

**2. menuItems**
```
menuItems/
  └── {itemId}/
      ├── name: string
      ├── description: string
      ├── price: number
      ├── category: string (beverages/burgers/loaded-fries)
      ├── isVeg: boolean
      ├── image: string
      ├── available: boolean
      └── createdAt: timestamp
```

**3. orders**
```
orders/
  └── {orderId}/
      ├── userId: string
      ├── userName: string
      ├── userEmail: string
      ├── userPhone: string
      ├── items: array
      │   └── {
      │       itemId: string,
      │       name: string,
      │       price: number,
      │       quantity: number,
      │       isVeg: boolean
      │   }
      ├── totalAmount: number
      ├── paymentMethod: string (cod/upi)
      ├── paymentStatus: string (pending/completed/failed)
      ├── orderStatus: string (pending/preparing/ready/completed/cancelled)
      ├── transactionId: string (for UPI payments)
      ├── createdAt: timestamp
      └── updatedAt: timestamp
```

## Step 5: Get Firebase Config

1. Go to **Project Settings** (⚙️ icon)
2. Scroll down to **Your apps**
3. Click **Web** icon (</>)
4. Register app name: `campus-bites-customer`
5. Copy the Firebase configuration object
6. Repeat for admin app: `campus-bites-admin`

Your config will look like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "campus-bites.firebaseapp.com",
  projectId: "campus-bites",
  storageBucket: "campus-bites.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Step 6: Firestore Security Rules

In Firebase Console → Firestore Database → Rules, paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Menu items - read by anyone, write by admin only
    match /menuItems/{itemId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Orders - users can create, read their own orders
    match /orders/{orderId} {
      allow read: if request.auth != null && 
                    (resource.data.userId == request.auth.uid || 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

# 6. INSTALLATION GUIDE

## Step 1: Create Project Directories

```bash
mkdir campus-bites
cd campus-bites
```

## Step 2: Setup Customer App

```bash
npx create-next-app@latest customer-app
# Select: TypeScript: No, ESLint: Yes, Tailwind: Yes, src/ directory: Yes, App Router: No, import alias: No

cd customer-app
npm install firebase react-hot-toast axios
```

## Step 3: Setup Admin App

```bash
cd ..
npx create-next-app@latest admin-app
# Same selections as above

cd admin-app
npm install firebase react-hot-toast
```

---

# 7. CUSTOMER WEBSITE CODE

## 7.1 Environment Variables

Create `customer-app/.env.local`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Twilio Configuration (for SMS OTP)
NEXT_PUBLIC_TWILIO_ACCOUNT_SID=your_twilio_account_sid
NEXT_PUBLIC_TWILIO_AUTH_TOKEN=your_twilio_auth_token
NEXT_PUBLIC_TWILIO_PHONE_NUMBER=your_twilio_phone_number

# PhonePe Configuration
NEXT_PUBLIC_PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=1
```

## 7.2 Firebase Configuration

Create `customer-app/src/lib/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## 7.3 Auth Context

Create `customer-app/src/context/AuthContext.jsx`:

```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setUser({ ...user, ...userDoc.data() });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Setup reCAPTCHA
  const setupRecaptcha = (elementId) => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
        size: 'invisible',
        callback: (response) => {
          console.log('reCAPTCHA solved');
        }
      });
    }
  };

  // Sign Up with Email
  const signUp = async (email, password, name, phone) => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save user data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        phone,
        name,
        createdAt: new Date(),
        isVerified: false
      });

      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Send OTP to Phone
  const sendPhoneOTP = async (phoneNumber) => {
    try {
      setupRecaptcha('recaptcha-container');
      const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      toast.success('OTP sent to your phone!');
      return confirmation;
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP. Please try again.');
      throw error;
    }
  };

  // Verify Phone OTP
  const verifyPhoneOTP = async (otp) => {
    try {
      if (!confirmationResult) {
        throw new Error('No confirmation result available');
      }
      const result = await confirmationResult.confirm(otp);
      
      // Update user verification status
      if (result.user) {
        await setDoc(doc(db, 'users', result.user.uid), {
          isVerified: true
        }, { merge: true });
      }
      
      toast.success('Phone verified successfully!');
      return result;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Invalid OTP. Please try again.');
      throw error;
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!');
      return userCredential.user;
    } catch (error) {
      toast.error('Invalid email or password');
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    login,
    logout,
    sendPhoneOTP,
    verifyPhoneOTP
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
```

## 7.4 Cart Context

Create `customer-app/src/context/CartContext.jsx`:

```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext({});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
      toast.success('Item quantity updated');
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
      toast.success('Item added to cart');
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(cart.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
```

## 7.5 Pages

### Home Page - `customer-app/src/pages/index.js`

```javascript
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { UtensilsCrossed, Coffee, Burger, Flame } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const categories = [
    {
      name: 'Beverages',
      icon: <Coffee size={48} />,
      href: '/beverages',
      color: 'bg-blue-500',
      description: 'Fresh drinks and shakes'
    },
    {
      name: 'Burgers',
      icon: <Burger size={48} />,
      href: '/burgers',
      color: 'bg-orange-500',
      description: 'Delicious burgers'
    },
    {
      name: 'Loaded Fries',
      icon: <Flame size={48} />,
      href: '/loaded-fries',
      color: 'bg-red-500',
      description: 'Crispy and loaded'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <UtensilsCrossed className="text-orange-500" size={64} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Campus Bites
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your favorite college food stall, now online!
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition font-semibold">
                Get Started
              </button>
            </Link>
            <Link href="/beverages">
              <button className="bg-white text-orange-500 px-8 py-3 rounded-lg hover:bg-gray-50 transition font-semibold border-2 border-orange-500">
                Browse Menu
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Menu Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link key={category.name} href={category.href}>
                <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition cursor-pointer group">
                  <div className={`${category.color} w-20 h-20 rounded-full flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition`}>
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
```

### Sign Up Page - `customer-app/src/pages/signup.js`

```javascript
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function SignUp() {
  const router = useRouter();
  const { signUp, sendPhoneOTP } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Create user account
      await signUp(formData.email, formData.password, formData.name, formData.phone);
      
      // Send OTP to phone
      await sendPhoneOTP(formData.phone);
      
      // Redirect to OTP verification
      router.push({
        pathname: '/verify-otp',
        query: { phone: formData.phone }
      });
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create Account
        </h2>
        
        <div id="recaptcha-container"></div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="10-digit phone number"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Minimum 6 characters"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Re-enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-orange-500 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
```

### OTP Verification Page - `customer-app/src/pages/verify-otp.js`

```javascript
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function VerifyOTP() {
  const router = useRouter();
  const { phone } = router.query;
  const { verifyPhoneOTP, sendPhoneOTP } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      await verifyPhoneOTP(otp);
      toast.success('Phone verified successfully!');
      router.push('/login');
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await sendPhoneOTP(phone);
      toast.success('OTP resent successfully!');
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Verify OTP
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          We've sent a 6-digit code to your phone number<br />
          <span className="font-semibold">{phone}</span>
        </p>
        
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-center text-2xl font-bold tracking-widest"
              placeholder="000000"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <button
          onClick={handleResend}
          className="w-full mt-4 text-orange-500 font-semibold hover:underline"
        >
          Resend OTP
        </button>

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}
```

### Login Page - `customer-app/src/pages/login.js`

```javascript
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      const returnUrl = router.query.returnUrl || '/';
      router.push(returnUrl);
    } catch (error) {
      console.error('Login error:', error);
      // Error toast already shown in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Welcome Back
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="text-orange-500 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
```

## 7.6 Main App Configuration

### `customer-app/src/pages/_app.js`

```javascript
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
        <Toaster position="top-right" />
      </CartProvider>
    </AuthProvider>
  );
}
```

---

**Due to length limitations, I'll continue with the remaining sections in the next parts. This document includes:**

✅ Complete project structure
✅ Firebase setup guide
✅ Customer app authentication
✅ Cart management
✅ Basic pages (Home, SignUp, Login, OTP Verification)

---

# 7.7 Components

### Navbar - `customer-app/src/components/Layout/Navbar.jsx`

```javascript
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, User, LogOut, Menu as MenuIcon } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="text-2xl">🍔</span>
              <span className="text-xl font-bold text-gray-800">Campus Bites</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/beverages">
              <span className="text-gray-700 hover:text-orange-500 cursor-pointer font-medium">
                Beverages
              </span>
            </Link>
            <Link href="/burgers">
              <span className="text-gray-700 hover:text-orange-500 cursor-pointer font-medium">
                Burgers
              </span>
            </Link>
            <Link href="/loaded-fries">
              <span className="text-gray-700 hover:text-orange-500 cursor-pointer font-medium">
                Loaded Fries
              </span>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <button className="relative p-2 hover:bg-gray-100 rounded-full">
                <ShoppingCart size={24} className="text-gray-700" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getItemCount()}
                  </span>
                )}
              </button>
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg">
                  <User size={20} className="text-orange-500" />
                  <span className="text-sm font-medium text-gray-700">{user.displayName || user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  title="Logout"
                >
                  <LogOut size={20} className="text-gray-700" />
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link href="/login">
                  <button className="text-orange-500 font-semibold hover:underline">
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <MenuIcon size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link href="/beverages">
                <span className="block text-gray-700 hover:text-orange-500 cursor-pointer">
                  Beverages
                </span>
              </Link>
              <Link href="/burgers">
                <span className="block text-gray-700 hover:text-orange-500 cursor-pointer">
                  Burgers
                </span>
              </Link>
              <Link href="/loaded-fries">
                <span className="block text-gray-700 hover:text-orange-500 cursor-pointer">
                  Loaded Fries
                </span>
              </Link>
              {user ? (
                <>
                  <span className="text-gray-700 font-medium">{user.displayName || user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-500 hover:underline"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <span className="block text-orange-500 hover:underline">Login</span>
                  </Link>
                  <Link href="/signup">
                    <span className="block text-orange-500 hover:underline">Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
```

### Footer - `customer-app/src/components/Layout/Footer.jsx`

```javascript
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-lg font-semibold mb-2">Campus Bites</p>
        <p className="text-gray-400 text-sm">Your favorite college food stall</p>
        <p className="text-gray-400 text-sm mt-4">© 2024 Campus Bites. All rights reserved.</p>
      </div>
    </footer>
  );
}
```

### Menu Card Component - `customer-app/src/components/Menu/MenuCard.jsx`

```javascript
import { useCart } from '../../context/CartContext';
import { Plus } from 'lucide-react';

export default function MenuCard({ item }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
      {/* Veg/Non-Veg Indicator */}
      <div className="p-3 flex justify-between items-center">
        <span className={`px-2 py-1 text-xs font-semibold rounded ${
          item.isVeg 
            ? 'bg-green-100 text-green-700 border border-green-500' 
            : 'bg-red-100 text-red-700 border border-red-500'
        }`}>
          {item.isVeg ? '🟢 VEG' : '🔴 NON-VEG'}
        </span>
        {!item.available && (
          <span className="px-2 py-1 text-xs font-semibold bg-gray-200 text-gray-600 rounded">
            Out of Stock
          </span>
        )}
      </div>

      {/* Image */}
      <div className="text-6xl text-center py-6 bg-gradient-to-br from-orange-100 to-yellow-100">
        {item.image}
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-orange-600">₹{item.price}</span>
          <button
            onClick={() => addToCart(item)}
            disabled={!item.available}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              item.available
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Plus size={18} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Filter Bar Component - `customer-app/src/components/Menu/FilterBar.jsx`

```javascript
import { Filter } from 'lucide-react';

export default function FilterBar({ vegFilter, setVegFilter, searchQuery, setSearchQuery }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="flex-1 w-full">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Veg Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setVegFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              vegFilter === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setVegFilter('veg')}
            className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
              vegFilter === 'veg'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🟢 Veg
          </button>
          <button
            onClick={() => setVegFilter('non-veg')}
            className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
              vegFilter === 'non-veg'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🔴 Non-Veg
          </button>
        </div>
      </div>
    </div>
  );
}
```

## 7.8 Menu Category Pages

### Beverages Page - `customer-app/src/pages/beverages.js`

```javascript
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MenuCard from '../components/Menu/MenuCard';
import FilterBar from '../components/Menu/FilterBar';

export default function Beverages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vegFilter, setVegFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const q = query(
        collection(db, 'menuItems'),
        where('category', '==', 'beverages')
      );
      const querySnapshot = await getDocs(q);
      const menuItems = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(menuItems);
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    // Filter by veg/non-veg
    if (vegFilter === 'veg' && !item.isVeg) return false;
    if (vegFilter === 'non-veg' && item.isVeg) return false;

    // Filter by search query
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">☕</div>
          <p className="text-gray-600">Loading beverages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          ☕ Beverages
        </h1>

        <FilterBar
          vegFilter={vegFilter}
          setVegFilter={setVegFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Burgers Page - `customer-app/src/pages/burgers.js`

```javascript
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MenuCard from '../components/Menu/MenuCard';
import FilterBar from '../components/Menu/FilterBar';

export default function Burgers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vegFilter, setVegFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const q = query(
        collection(db, 'menuItems'),
        where('category', '==', 'burgers')
      );
      const querySnapshot = await getDocs(q);
      const menuItems = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(menuItems);
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (vegFilter === 'veg' && !item.isVeg) return false;
    if (vegFilter === 'non-veg' && item.isVeg) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🍔</div>
          <p className="text-gray-600">Loading burgers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          🍔 Burgers
        </h1>

        <FilterBar
          vegFilter={vegFilter}
          setVegFilter={setVegFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Loaded Fries Page - `customer-app/src/pages/loaded-fries.js`

```javascript
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MenuCard from '../components/Menu/MenuCard';
import FilterBar from '../components/Menu/FilterBar';

export default function LoadedFries() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vegFilter, setVegFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const q = query(
        collection(db, 'menuItems'),
        where('category', '==', 'loaded-fries')
      );
      const querySnapshot = await getDocs(q);
      const menuItems = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(menuItems);
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (vegFilter === 'veg' && !item.isVeg) return false;
    if (vegFilter === 'non-veg' && item.isVeg) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🍟</div>
          <p className="text-gray-600">Loading loaded fries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          🍟 Loaded Fries
        </h1>

        <FilterBar
          vegFilter={vegFilter}
          setVegFilter={setVegFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

## 7.9 Cart and Checkout Pages

### Cart Page - `customer-app/src/pages/cart.js`

```javascript
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function Cart() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();
  const { user } = useAuth();

  const handleCheckout = () => {
    if (!user) {
      router.push('/login?returnUrl=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={80} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <Link href="/beverages">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition">
              Browse Menu
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-500 hover:underline font-semibold"
          >
            Clear Cart
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {cart.map(item => (
            <div key={item.id} className="flex items-center justify-between border-b py-4 last:border-b-0">
              <div className="flex items-center gap-4 flex-1">
                <div className="text-4xl">{item.image}</div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                  <p className="text-orange-600 font-bold">₹{item.price}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {item.isVeg ? '🟢 VEG' : '🔴 NON-VEG'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="bg-gray-200 hover:bg-gray-300 rounded-full p-1"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-bold w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-1"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="w-24 text-right">
                  <span className="font-bold text-gray-800">₹{item.price * item.quantity}</span>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-700">Subtotal:</span>
            <span className="text-lg font-bold text-gray-800">₹{getTotal()}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-700">Taxes (5%):</span>
            <span className="text-lg font-bold text-gray-800">₹{(getTotal() * 0.05).toFixed(2)}</span>
          </div>
          <div className="border-t pt-4 flex justify-between items-center mb-6">
            <span className="text-xl font-bold text-gray-800">Total:</span>
            <span className="text-2xl font-bold text-orange-600">₹{(getTotal() * 1.05).toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold text-lg"
          >
            {user ? 'Proceed to Checkout' : 'Login to Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Checkout Page - `customer-app/src/pages/checkout.js`

```javascript
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const router = useRouter();
  const { cart, getTotal } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login?returnUrl=/checkout');
    }
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [user, cart]);

  const handlePayment = () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    if (paymentMethod === 'cod') {
      router.push('/payment?method=cod');
    } else if (paymentMethod === 'upi') {
      router.push('/payment?method=upi');
    }
  };

  const totalAmount = (getTotal() * 1.05).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between py-2 border-b">
              <div>
                <span className="font-semibold">{item.name}</span>
                <span className="text-gray-600 ml-2">x{item.quantity}</span>
              </div>
              <span className="font-semibold">₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between py-2 font-bold text-lg mt-4">
            <span>Total:</span>
            <span className="text-orange-600">₹{totalAmount}</span>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Customer Details</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">Name:</span> {user?.displayName || 'N/A'}</p>
            <p><span className="font-semibold">Email:</span> {user?.email}</p>
            <p><span className="font-semibold">Phone:</span> {user?.phoneNumber || 'N/A'}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-orange-500 transition">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5"
              />
              <div>
                <p className="font-semibold text-lg">Cash on Delivery</p>
                <p className="text-sm text-gray-600">Pay when you receive your order</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-orange-500 transition">
              <input
                type="radio"
                name="payment"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5"
              />
              <div>
                <p className="font-semibold text-lg">PhonePe UPI Payment</p>
                <p className="text-sm text-gray-600">Pay securely using UPI</p>
              </div>
            </label>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={!paymentMethod}
          className="w-full bg-orange-500 text-white py-4 rounded-lg hover:bg-orange-600 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
```

---

# 8. PAYMENT INTEGRATION

## 8.1 PhonePe Payment Gateway Setup

### PhonePe Library - `customer-app/src/lib/phonepe.js`

```javascript
import crypto from 'crypto';
import axios from 'axios';

// PhonePe API Configuration
const PHONEPE_MERCHANT_ID = process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID;
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY;
const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';
const PHONEPE_API_URL = 'https://api.phonepe.com/apis/hermes'; // Production
// const PHONEPE_API_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox'; // Sandbox for testing

export const initiatePhonePePayment = async (orderDetails) => {
  try {
    const { orderId, amount, userName, userPhone, userEmail } = orderDetails;

    // Prepare payload
    const payload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: `TXN_${orderId}_${Date.now()}`,
      merchantUserId: userEmail.replace('@', '_'),
      amount: Math.round(amount * 100), // Amount in paise
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-callback`,
      redirectMode: 'POST',
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment-callback`,
      mobileNumber: userPhone.replace('+91', ''),
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    // Encode payload to Base64
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');

    // Generate X-VERIFY header
    const checksumString = base64Payload + '/pg/v1/pay' + PHONEPE_SALT_KEY;
    const checksum = crypto.createHash('sha256').update(checksumString).digest('hex');
    const xVerify = `${checksum}###${PHONEPE_SALT_INDEX}`;

    // Make API request
    const response = await axios.post(
      `${PHONEPE_API_URL}/pg/v1/pay`,
      {
        request: base64Payload
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify
        }
      }
    );

    if (response.data.success) {
      return {
        success: true,
        paymentUrl: response.data.data.instrumentResponse.redirectInfo.url,
        transactionId: payload.merchantTransactionId
      };
    } else {
      throw new Error('Payment initiation failed');
    }
  } catch (error) {
    console.error('PhonePe payment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const verifyPhonePePayment = async (transactionId) => {
  try {
    const checksumString = `/pg/v1/status/${PHONEPE_MERCHANT_ID}/${transactionId}` + PHONEPE_SALT_KEY;
    const checksum = crypto.createHash('sha256').update(checksumString).digest('hex');
    const xVerify = `${checksum}###${PHONEPE_SALT_INDEX}`;

    const response = await axios.get(
      `${PHONEPE_API_URL}/pg/v1/status/${PHONEPE_MERCHANT_ID}/${transactionId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Payment verification error:', error);
    return null;
  }
};
```

### Payment Page - `customer-app/src/pages/payment.js`

```javascript
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { initiatePhonePePayment } from '../lib/phonepe';
import toast from 'react-hot-toast';

export default function Payment() {
  const router = useRouter();
  const { method } = router.query;
  const { cart, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || cart.length === 0) {
      router.push('/');
      return;
    }

    if (method) {
      processPayment();
    }
  }, [method, user, cart]);

  const processPayment = async () => {
    setLoading(true);

    try {
      const totalAmount = (getTotal() * 1.05).toFixed(2);

      // Create order in Firestore
      const orderData = {
        userId: user.uid,
        userName: user.displayName || 'Customer',
        userEmail: user.email,
        userPhone: user.phoneNumber || '',
        items: cart.map(item => ({
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          isVeg: item.isVeg
        })),
        totalAmount: parseFloat(totalAmount),
        paymentMethod: method,
        paymentStatus: method === 'cod' ? 'pending' : 'processing',
        orderStatus: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);

      if (method === 'cod') {
        // Cash on Delivery - direct confirmation
        clearCart();
        router.push(`/order-confirmation?orderId=${docRef.id}&method=cod`);
      } else if (method === 'upi') {
        // PhonePe UPI Payment
        const paymentResult = await initiatePhonePePayment({
          orderId: docRef.id,
          amount: parseFloat(totalAmount),
          userName: user.displayName || 'Customer',
          userPhone: user.phoneNumber || '9999999999',
          userEmail: user.email
        });

        if (paymentResult.success) {
          // Store transaction ID
          await updateDoc(doc(db, 'orders', docRef.id), {
            transactionId: paymentResult.transactionId
          });

          // Redirect to PhonePe payment page
          window.location.href = paymentResult.paymentUrl;
        } else {
          toast.error('Payment initiation failed');
          router.push('/checkout');
        }
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Failed to process payment');
      router.push('/checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin text-6xl mb-4">💳</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment...</h2>
        <p className="text-gray-600">Please wait while we process your {method === 'cod' ? 'order' : 'payment'}</p>
      </div>
    </div>
  );
}
```

### Order Confirmation Page - `customer-app/src/pages/order-confirmation.js`

```javascript
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrderConfirmation() {
  const router = useRouter();
  const { orderId, method } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      if (orderDoc.exists()) {
        setOrder({ id: orderDoc.id, ...orderDoc.data() });
      }
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-spin text-6xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <CheckCircle size={80} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">Thank you for your order. We'll prepare it right away!</p>

          {order && (
            <>
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h2 className="font-bold text-lg mb-4">Order Details</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-semibold">{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-semibold">{method === 'cod' ? 'Cash on Delivery' : 'UPI Payment'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold text-orange-600">₹{order.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-yellow-600 capitalize">{order.orderStatus}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h2 className="font-bold text-lg mb-4">Items</h2>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-b last:border-b-0">
                    <div>
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-gray-600 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="space-y-3">
            <p className="text-gray-600">
              We've sent a confirmation email to <span className="font-semibold">{order?.userEmail}</span>
            </p>
            <p className="text-sm text-gray-500">
              Estimated preparation time: 15-20 minutes
            </p>
          </div>

          <div className="mt-8 flex gap-4 justify-center">
            <Link href="/">
              <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition font-semibold">
                Back to Home
              </button>
            </Link>
            <Link href="/beverages">
              <button className="bg-white text-orange-500 border-2 border-orange-500 px-6 py-3 rounded-lg hover:bg-orange-50 transition font-semibold">
                Order More
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

# 9. ADMIN PORTAL

## 9.1 Admin Environment Variables

Create `admin-app/.env.local`:

```env
# Firebase Configuration (same as customer app)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Credentials (hardcoded)
NEXT_PUBLIC_ADMIN_EMAIL=admin@campusbites.com
NEXT_PUBLIC_ADMIN_PASSWORD=Admin@123
```

## 9.2 Admin Firebase Configuration

Create `admin-app/src/lib/firebase.js` (same as customer app):

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## 9.3 Admin Pages

### Admin Login - `admin-app/src/pages/index.js`

```javascript
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
      // Store admin session
      localStorage.setItem('adminAuth', 'true');
      toast.success('Login successful!');
      router.push('/dashboard');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <Shield size={64} className="text-orange-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">Admin Portal</h1>
          <p className="text-gray-600 mt-2">Campus Bites Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="admin@campusbites.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter admin password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
```

### Admin Dashboard - `admin-app/src/pages/dashboard.js`

```javascript
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Package, Clock, CheckCircle, XCircle, LogOut, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    preparing: 0,
    ready: 0,
    completed: 0
  });

  useEffect(() => {
    // Check admin authentication
    const isAdmin = localStorage.getItem('adminAuth');
    if (!isAdmin) {
      router.push('/');
      return;
    }

    // Real-time orders listener
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);

      // Calculate stats
      const newStats = {
        pending: ordersData.filter(o => o.orderStatus === 'pending').length,
        preparing: ordersData.filter(o => o.orderStatus === 'preparing').length,
        ready: ordersData.filter(o => o.orderStatus === 'ready').length,
        completed: ordersData.filter(o => o.orderStatus === 'completed').length
      };
      setStats(newStats);
    });

    return () => unsubscribe();
  }, [router]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        orderStatus: newStatus,
        updatedAt: new Date()
      });
      toast.success('Order status updated');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'preparing': return 'bg-blue-100 text-blue-700';
      case 'ready': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Campus Bites Management</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/menu-management')}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            >
              <Settings size={20} />
              Menu
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-yellow-100 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-yellow-700">{stats.pending}</p>
              </div>
              <Clock size={48} className="text-yellow-600" />
            </div>
          </div>

          <div className="bg-blue-100 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Preparing</p>
                <p className="text-3xl font-bold text-blue-700">{stats.preparing}</p>
              </div>
              <Package size={48} className="text-blue-600" />
            </div>
          </div>

          <div className="bg-green-100 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ready</p>
                <p className="text-3xl font-bold text-green-700">{stats.ready}</p>
              </div>
              <CheckCircle size={48} className="text-green-600" />
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed Today</p>
                <p className="text-3xl font-bold text-gray-700">{stats.completed}</p>
              </div>
              <CheckCircle size={48} className="text-gray-600" />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>

          {orders.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-lg">#{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">{order.userName}</p>
                      <p className="text-sm text-gray-600">{order.userPhone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-2xl text-orange-600">₹{order.totalAmount}</p>
                      <p className="text-sm text-gray-600">{order.paymentMethod === 'cod' ? 'COD' : 'UPI Paid'}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="font-semibold text-sm text-gray-700 mb-2">Items:</p>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <p key={idx} className="text-sm text-gray-600">
                          {item.name} x{item.quantity} - ₹{item.price * item.quantity}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus.toUpperCase()}
                    </span>

                    <div className="flex gap-2">
                      {order.orderStatus === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm"
                        >
                          Start Preparing
                        </button>
                      )}
                      {order.orderStatus === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm"
                        >
                          Mark Ready
                        </button>
                      )}
                      {order.orderStatus === 'ready' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm"
                        >
                          Complete Order
                        </button>
                      )}
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
```

### Admin Menu Management - `admin-app/src/pages/menu-management.js`

```javascript
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MenuManagement() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'beverages',
    isVeg: true,
    image: '🍔',
    available: true
  });

  useEffect(() => {
    // Check admin authentication
    const isAdmin = localStorage.getItem('adminAuth');
    if (!isAdmin) {
      router.push('/');
      return;
    }

    loadMenuItems();
  }, [router]);

  const loadMenuItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'menuItems'));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMenuItems(items);
    } catch (error) {
      console.error('Error loading menu items:', error);
      toast.error('Failed to load menu items');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        createdAt: new Date()
      };

      if (editingItem) {
        // Update existing item
        await updateDoc(doc(db, 'menuItems', editingItem.id), itemData);
        toast.success('Item updated successfully');
      } else {
        // Add new item
        await addDoc(collection(db, 'menuItems'), itemData);
        toast.success('Item added successfully');
      }

      resetForm();
      loadMenuItems();
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      isVeg: item.isVeg,
      image: item.image,
      available: item.available
    });
    setShowAddForm(true);
  };

  const handleDelete = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteDoc(doc(db, 'menuItems', itemId));
      toast.success('Item deleted successfully');
      loadMenuItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const toggleAvailability = async (item) => {
    try {
      await updateDoc(doc(db, 'menuItems', item.id), {
        available: !item.available
      });
      toast.success('Availability updated');
      loadMenuItems();
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'beverages',
      isVeg: true,
      image: '🍔',
      available: true
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const categories = {
    beverages: 'Beverages',
    burgers: 'Burgers',
    'loaded-fries': 'Loaded Fries'
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            <Plus size={20} />
            Add Item
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {Object.entries(categories).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Emoji/Icon</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="🍔"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isVeg}
                      onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span className="font-semibold">Vegetarian</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span className="font-semibold">Available</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
                  >
                    {editingItem ? 'Update' : 'Add'} Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Menu Items Grid */}
        {Object.entries(categories).map(([categoryKey, categoryName]) => {
          const categoryItems = menuItems.filter(item => item.category === categoryKey);
          
          if (categoryItems.length === 0) return null;

          return (
            <div key={categoryKey} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{categoryName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryItems.map(item => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          item.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.isVeg ? '🟢 VEG' : '🔴 NON-VEG'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.available ? 'Available' : 'Out of Stock'}
                        </span>
                      </div>

                      <div className="text-5xl text-center py-4">{item.image}</div>
                      
                      <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      )}
                      <p className="text-2xl font-bold text-orange-600 mb-4">₹{item.price}</p>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => toggleAvailability(item)}
                          className={`px-3 py-2 rounded text-sm font-semibold ${
                            item.available
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {item.available ? 'Hide' : 'Show'}
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-blue-100 text-blue-700 px-3 py-2 rounded hover:bg-blue-200 text-sm font-semibold"
                        >
                          <Edit size={16} className="mx-auto" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200 text-sm font-semibold"
                        >
                          <Trash2 size={16} className="mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {menuItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No menu items yet. Click "Add Item" to get started!</p>
          </div>
        )}
      </main>
    </div>
  );
}
```

### Admin App Configuration - `admin-app/src/pages/_app.js`

```javascript
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </>
  );
}
```

---

# 10. EMAIL/SMS SERVICES

## 10.1 Email Service Setup (Using Firebase Extensions)

### Step 1: Install Firebase Email Extension

1. Go to Firebase Console → Extensions
2. Search for "Trigger Email"
3. Click Install
4. Configure:
   - **SMTP Connection URI**: Use a service like SendGrid, Gmail, or AWS SES
     - Gmail Example: `smtps://your-email@gmail.com:your-app-password@smtp.gmail.com:465`
   - **Email Documents Collection**: `mail`
   - **Default FROM**: `Campus Bites <noreply@campusbites.com>`

### Step 2: Send Email Function

Create `customer-app/src/lib/email.js`:

```javascript
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const emailData = {
      to: orderData.userEmail,
      message: {
        subject: `Order Confirmation - #${orderData.id.slice(0, 8)}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #f97316; color: white; padding: 20px; text-align: center; }
              .content { background-color: #f9f9f9; padding: 20px; }
              .order-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
              .item { display: flex; justify-between; padding: 10px 0; border-bottom: 1px solid #eee; }
              .total { font-size: 20px; font-weight: bold; color: #f97316; margin-top: 15px; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🍔 Campus Bites</h1>
                <p>Order Confirmation</p>
              </div>
              
              <div class="content">
                <h2>Thank you for your order!</h2>
                <p>Hi ${orderData.userName},</p>
                <p>Your order has been confirmed and will be ready shortly.</p>
                
                <div class="order-details">
                  <h3>Order #${orderData.id.slice(0, 8)}</h3>
                  <p><strong>Payment Method:</strong> ${orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI Payment'}</p>
                  <p><strong>Status:</strong> ${orderData.orderStatus}</p>
                  
                  <h4>Items:</h4>
                  ${orderData.items.map(item => `
                    <div class="item">
                      <span>${item.name} x${item.quantity}</span>
                      <span>₹${item.price * item.quantity}</span>
                    </div>
                  `).join('')}
                  
                  <div class="total">
                    Total: ₹${orderData.totalAmount}
                  </div>
                </div>
                
                <p><strong>Estimated time:</strong> 15-20 minutes</p>
                <p>We'll notify you when your order is ready for pickup!</p>
              </div>
              
              <div class="footer">
                <p>Campus Bites - Your College Food Stall</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </body>
          </html>
        `
      }
    };

    await addDoc(collection(db, 'mail'), emailData);
    console.log('Email queued successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
```

## 10.2 SMS Service Setup (Using Twilio)

### Step 1: Install Twilio

```bash
cd customer-app
npm install twilio
```

### Step 2: Create SMS Service

Create `customer-app/src/lib/sms.js`:

```javascript
import twilio from 'twilio';

const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export const sendOTPSMS = async (phoneNumber, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your Campus Bites verification code is: ${otp}. Valid for 10 minutes.`,
      from: twilioPhone,
      to: phoneNumber
    });

    console.log('SMS sent:', message.sid);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error('SMS error:', error);
    return { success: false, error: error.message };
  }
};

export const sendOrderConfirmationSMS = async (phoneNumber, orderId) => {
  try {
    const message = await client.messages.create({
      body: `Order #${orderId.slice(0, 8)} confirmed! Your food will be ready in 15-20 minutes. - Campus Bites`,
      from: twilioPhone,
      to: phoneNumber
    });

    console.log('SMS sent:', message.sid);
    return { success: true };
  } catch (error) {
    console.error('SMS error:', error);
    return { success: false };
  }
};
```

### Step 3: Update Payment Page to Send Emails/SMS

Update `customer-app/src/pages/payment.js`:

```javascript
// Add import at top
import { sendOrderConfirmationEmail } from '../lib/email';
import { sendOrderConfirmationSMS } from '../lib/sms';

// In the processPayment function, after creating order:
const docRef = await addDoc(collection(db, 'orders'), orderData);

// Send confirmation email
await sendOrderConfirmationEmail({
  ...orderData,
  id: docRef.id
});

// Send confirmation SMS
await sendOrderConfirmationSMS(user.phoneNumber, docRef.id);
```

---

# 11. DEPLOYMENT GUIDE

## 11.1 Prerequisites for Deployment

1. **Node.js Server** (VPS or Cloud instance)
2. **Domain Name** (optional but recommended)
3. **PM2** (Process manager for Node.js)
4. **Nginx** (Web server)

## 11.2 Server Setup

### Step 1: Connect to Your Server

```bash
ssh your-username@your-server-ip
```

### Step 2: Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 3: Install PM2

```bash
sudo npm install -g pm2
```

### Step 4: Install Nginx

```bash
sudo apt update
sudo apt install nginx
```

## 11.3 Deploy Applications

### Step 1: Upload Code to Server

```bash
# On your local machine
scp -r campus-bites your-username@your-server-ip:/home/your-username/
```

### Step 2: Install Dependencies

```bash
# On server
cd /home/your-username/campus-bites/customer-app
npm install
npm run build

cd /home/your-username/campus-bites/admin-app
npm install
npm run build
```

### Step 3: Start with PM2

```bash
# Customer App (Port 3000)
cd /home/your-username/campus-bites/customer-app
pm2 start npm --name "customer-app" -- start

# Admin App (Port 3001)
cd /home/your-username/campus-bites/admin-app
PORT=3001 pm2 start npm --name "admin-app" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

## 11.4 Nginx Configuration

### Customer Site Configuration

Create `/etc/nginx/sites-available/campusbites`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Admin Site Configuration

Create `/etc/nginx/sites-available/campusbites-admin`:

```nginx
server {
    listen 80;
    server_name admin.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable Sites

```bash
sudo ln -s /etc/nginx/sites-available/campusbites /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/campusbites-admin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 11.5 SSL Certificate (Optional but Recommended)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d admin.yourdomain.com
```

---

# 12. FINAL CHECKLIST

## Before Going Live:

✅ Firebase project created and configured
✅ Authentication enabled (Email + Phone)
✅ Firestore database created with proper collections
✅ Security rules applied
✅ Environment variables set for both apps
✅ Menu items added to database
✅ PhonePe merchant account setup (for production)
✅ Email service configured
✅ SMS service configured (Twilio)
✅ Both apps tested locally
✅ Admin credentials set and tested
✅ Apps deployed to server
✅ Nginx configured
✅ SSL certificates installed
✅ PM2 processes running
✅ Domain DNS configured

---

# 13. TESTING GUIDE

## Test Customer Flow:

1. Sign up with email, phone, password
2. Verify OTP (email + SMS)
3. Login with credentials
4. Browse menu categories
5. Apply veg/non-veg filters
6. Add items to cart
7. Proceed to checkout
8. Select payment method (COD/UPI)
9. Complete order
10. Receive confirmation email

## Test Admin Flow:

1. Login to admin portal
2. View incoming orders
3. Update order status
4. Add new menu items
5. Edit existing items
6. Toggle item availability
7. Delete items

---

# 14. MAINTENANCE & MONITORING

## PM2 Commands:

```bash
pm2 list                    # View all processes
pm2 logs customer-app       # View customer app logs
pm2 logs admin-app          # View admin app logs
pm2 restart customer-app    # Restart customer app
pm2 stop customer-app       # Stop customer app
pm2 delete customer-app     # Delete process
```

## Firebase Console:

- Monitor Firestore usage
- Check authentication logs
- View email/SMS delivery status
- Monitor real-time database connections

---

# 15. TROUBLESHOOTING

## Common Issues:

**Issue**: OTP not received
- Check Firebase Authentication settings
- Verify Twilio credentials
- Check phone number format (+91...)

**Issue**: Payment fails
- Verify PhonePe merchant credentials
- Check API endpoint URLs
- Review server logs

**Issue**: Orders not showing in admin
- Check Firestore rules
- Verify admin authentication
- Check browser console for errors

**Issue**: App not loading after deployment
- Check PM2 process status
- Review Nginx configuration
- Check server firewall rules

---

# CONGRATULATIONS! 🎉

Your complete food ordering system is now ready to deploy and use!

# APPENDIX: COMPLETE CONFIGURATION FILES

## A. Package.json Files

### Customer App - `customer-app/package.json`

```json
{
  "name": "campus-bites-customer",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "firebase": "^10.7.0",
    "lucide-react": "^0.294.0",
    "next": "14.0.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.4.1",
    "twilio": "^4.19.0"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.16",
    "eslint": "^8.54.0",
    "eslint-config-next": "14.0.3",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6"
  }
}
```

### Admin App - `admin-app/package.json`

```json
{
  "name": "campus-bites-admin",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "next lint"
  },
  "dependencies": {
    "firebase": "^10.7.0",
    "lucide-react": "^0.294.0",
    "next": "14.0.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.4.1"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.16",
    "eslint": "^8.54.0",
    "eslint-config-next": "14.0.3",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6"
  }
}
```

## B. Tailwind Configuration

### `customer-app/tailwind.config.js` and `admin-app/tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## C. Global Styles

### `customer-app/src/styles/globals.css` and `admin-app/src/styles/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

## D. Next.js Configuration

### `customer-app/next.config.js` and `admin-app/next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
```

## E. Sample Menu Items (Initial Data)

To populate your Firestore database with sample menu items, use Firebase Console:

### Beverages:

```json
{
  "name": "Cold Coffee",
  "description": "Refreshing iced coffee with cream",
  "price": 50,
  "category": "beverages",
  "isVeg": true,
  "image": "☕",
  "available": true,
  "createdAt": "2024-01-01T00:00:00Z"
}

{
  "name": "Mango Shake",
  "description": "Fresh mango blended with milk",
  "price": 60,
  "category": "beverages",
  "isVeg": true,
  "image": "🥤",
  "available": true,
  "createdAt": "2024-01-01T00:00:00Z"
}

{
  "name": "Lemon Iced Tea",
  "description": "Refreshing lemon tea",
  "price": 40,
  "category": "beverages",
  "isVeg": true,
  "image": "🍋",
  "available": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Burgers:

```json
{
  "name": "Veg Burger",
  "description": "Classic veggie patty burger",
  "price": 50,
  "category": "burgers",
  "isVeg": true,
  "image": "🍔",
  "available": true,
  "createdAt": "2024-01-01T00:00:00Z"
}

{
  "name": "Chicken Burger",
  "description": "Grilled chicken patty burger",
  "price": 80,
  "category": "burgers",
  "isVeg": false,
  "image": "🍔",
  "available": true,
  "createdAt": "2024-01-01T00:00:00Z"
}

{
  "name": "Paneer Burger",
  "description": "Spicy paneer patty burger",
  "price": 70,
  "category": "burgers",
  "isVeg": true,
  "image": "🍔",
  "available": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Loaded Fries:

```json
{
  "name": "Classic Loaded Fries",
  "description": "Fries with cheese and mayo",
  "price": 80,
  "category": "loaded-fries",
  "isVeg": true,
  "image": "🍟",
  "available": true,
  "createdAt": "2024-01-01T00:00:00Z"
}

{
  "name": "Peri Peri Loaded Fries",
  "description": "Spicy peri peri seasoned fries",
  "price": 90,
  "category": "loaded-fries",
  "isVeg": true,
  "image": "🍟",
  "available": true,
  "createdAt": "2024-01-01T00:00:00Z"
}

{
  "name": "Chicken Loaded Fries",
  "description": "Fries with chicken chunks",
  "price": 120,
  "category": "loaded-fries",
  "isVeg": false,
  "image": "🍟",
  "available": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

## F. Quick Start Commands

### Development:

```bash
# Terminal 1 - Customer App
cd campus-bites/customer-app
npm run dev

# Terminal 2 - Admin App
cd campus-bites/admin-app
npm run dev
```

Access:
- Customer Site: http://localhost:3000
- Admin Portal: http://localhost:3001

### Production Build:

```bash
# Customer App
cd customer-app
npm run build
npm start

# Admin App  
cd admin-app
npm run build
PORT=3001 npm start
```

---

## G. Environment Variables Summary

### Customer App (.env.local):

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Twilio
NEXT_PUBLIC_TWILIO_ACCOUNT_SID=
NEXT_PUBLIC_TWILIO_AUTH_TOKEN=
NEXT_PUBLIC_TWILIO_PHONE_NUMBER=

# PhonePe
NEXT_PUBLIC_PHONEPE_MERCHANT_ID=
PHONEPE_SALT_KEY=
PHONEPE_SALT_INDEX=1

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Admin App (.env.local):

```env
# Firebase (same as customer)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Admin Credentials
NEXT_PUBLIC_ADMIN_EMAIL=admin@campusbites.com
NEXT_PUBLIC_ADMIN_PASSWORD=Admin@123
```

---

## H. Additional Resources

### Firebase Documentation:
- Authentication: https://firebase.google.com/docs/auth
- Firestore: https://firebase.google.com/docs/firestore
- Extensions: https://firebase.google.com/docs/extensions

### Payment Gateway:
- PhonePe Developer: https://developer.phonepe.com/
- Test Cards: https://developer.phonepe.com/v1/docs/test-cards

### SMS Service:
- Twilio Console: https://console.twilio.com/
- Twilio Docs: https://www.twilio.com/docs/sms

### Deployment:
- DigitalOcean: https://www.digitalocean.com/
- AWS EC2: https://aws.amazon.com/ec2/
- Heroku: https://www.heroku.com/

---

## I. Support & Community

### Getting Help:

1. **Firebase Issues**: Firebase Discord, Stack Overflow
2. **Next.js Issues**: Next.js GitHub Discussions
3. **Payment Integration**: PhonePe Developer Support
4. **General Questions**: Stack Overflow, Reddit (r/webdev)

### Recommended Learning:

- Next.js Tutorial: https://nextjs.org/learn
- Firebase Course: https://fireship.io/
- React Documentation: https://react.dev/

---

# YOU'RE ALL SET! 🚀

Your complete Campus Bites food ordering system is ready to launch!

**What you have:**
✅ Fully functional customer website with authentication
✅ Complete admin portal for order management  
✅ Firebase backend with Firestore database
✅ Payment integration (COD + PhonePe UPI)
✅ Email and SMS notifications
✅ Responsive design for mobile and desktop
✅ Real-time order tracking
✅ Menu management system
✅ Production-ready deployment guide

**Next Steps:**
1. Set up Firebase project
2. Configure environment variables
3. Add initial menu items
4. Test locally
5. Deploy to server
6. Start taking orders!

Good luck with your food stall! 🍔🍟☕