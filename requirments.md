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