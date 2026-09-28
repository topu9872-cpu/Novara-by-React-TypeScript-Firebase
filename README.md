# Novara — Modern E-Commerce Platform

**Novara** is a modern, full-stack e-commerce web application built with **React, TypeScript, Firebase, Stripe, and Tailwind CSS**. It provides a complete shopping experience with authentication, product management, cart functionality, checkout, order management, notifications, and an admin dashboard.

## Live Demo

**Live Website:** https://novara-7b539.web.app

**GitHub Repository:** https://github.com/topu9872-cpu/Novara-by-React-TypeScript-Firebase

---

## Features

### Authentication

* Email & password authentication
* Google authentication
* Facebook authentication
* GitHub authentication
* Protected routes
* User-specific cart and order data
* Role-based admin access

### Shopping Experience

* Browse products
* Product details
* Product availability and stock status
* Add products to cart
* Update cart quantities
* Remove products from cart
* Persistent user cart
* Responsive design

### Checkout & Payments

* Stripe Checkout integration
* Secure checkout session creation
* Payment verification
* Order creation after successful payment
* Order history for users

### Admin Dashboard

* Admin-only dashboard
* Product management
* Order management
* User-related information
* Sales and order statistics
* Charts and analytics using Recharts
* Protected admin routes

### Notifications

* Order-related notifications
* User notifications stored in Firebase
* Toast notifications using Sonner

### UI & Animations

* Responsive design
* Tailwind CSS
* DaisyUI
* Styled Components
* Lucide React
* React Icons
* GSAP animations
* Modern component-based architecture

---

## Tech Stack

### Frontend

* React 19
* TypeScript
* Vite
* React Router
* Tailwind CSS
* DaisyUI
* Styled Components
* GSAP
* Recharts
* Lucide React
* React Icons
* Sonner

### Backend & Services

* Firebase Authentication
* Firebase Firestore
* Firebase Cloud Functions
* Firebase Admin SDK
* Firebase Hosting
* Stripe
* Nodemailer

### Development

* ESLint
* TypeScript
* Vite
* Firebase CLI

---

## Project Architecture

```text
Novara
├── Client
│   ├── React
│   ├── TypeScript
│   ├── React Router
│   ├── Tailwind CSS
│   └── Firebase Client SDK
│
├── Firebase
│   ├── Authentication
│   ├── Firestore
│   ├── Cloud Functions
│   └── Hosting
│
├── Payment System
│   ├── Stripe Checkout
│   ├── Checkout Session
│   └── Payment Verification
│
└── Admin Dashboard
    ├── Products
    ├── Orders
    ├── Users
    └── Analytics
```

---

## Firestore Structure

The application uses Firebase Firestore for application data.

```text
Products
├── productId
├── name
├── description
├── price
├── category
├── stock
├── status
└── image

orders
├── orderId
├── userId
├── products
├── amount
├── paymentStatus
├── createdAt
└── customer information

users
└── userId
    └── cart
        ├── productId
        ├── quantity
        └── product information

notifications
├── notificationId
├── userId
├── message
├── type
├── read
└── createdAt
```

---

## Environment Variables

Create the required environment variables before running the project.

### Frontend

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_STRIPE_PUBLISHABLE_KEY=
```

### Backend / Cloud Functions

Keep sensitive credentials and secrets inside Firebase Functions configuration or environment variables.

```env
STRIPE_SECRET_KEY=
```

> Never commit API keys, Stripe secret keys, Firebase service-account credentials, or other private secrets to GitHub.

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/topu9872-cpu/Novara-by-React-TypeScript-Firebase.git
```

### 2. Navigate into the project

```bash
cd Novara
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file and add the required Firebase and Stripe configuration.

### 5. Start the development server

```bash
npm run dev
```

The application will be available through the Vite development server.

---

## Available Scripts

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start development server         |
| `npm run build`   | Build the production application |
| `npm run lint`    | Run ESLint                       |
| `npm run preview` | Preview production build         |

---

## Payment Flow

Novara uses Stripe for secure payment processing.

```text
User
  ↓
Add Products
  ↓
Shopping Cart
  ↓
Checkout
  ↓
Create Stripe Checkout Session
  ↓
Stripe Payment
  ↓
Verify Payment
  ↓
Create Order
  ↓
Order Confirmation
```

Orders are created after successful payment verification rather than simply when a user starts checkout.

---

## Authentication Flow

```text
User
  ↓
Firebase Authentication
  ↓
Authenticated User
  ↓
Check User Role
  ↓
├── Customer → Shopping / Orders
│
└── Admin → Admin Dashboard
```

Admin functionality is protected using the user's role rather than relying only on a frontend URL.

---

## Security

The project uses several layers of protection:

* Firebase Authentication
* Protected routes
* Role-based admin authorization
* Firestore security rules
* Stripe server-side secret handling
* Firebase Admin SDK
* Server-side payment verification
* Environment variables for sensitive configuration

Sensitive credentials are intentionally excluded from the repository.

---

## Responsive Design

Novara is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile devices

The interface uses Tailwind CSS and responsive layouts to provide a consistent shopping experience across screen sizes.

---

## Screenshots

Add your project screenshots here:

```md
![Novara Home Page](./screenshots/home.png)

![Novara Products](./screenshots/products.png)

![Novara Cart](./screenshots/cart.png)

![Novara Admin Dashboard](./screenshots/admin-dashboard.png)
```

---

## What I Learned

Building Novara helped me gain practical experience with:

* React + TypeScript application architecture
* Firebase Authentication
* Firestore data modeling
* Protected routes
* Role-based authorization
* Stripe payment integration
* Cloud Functions
* Firebase Hosting
* Transaction-based Firestore operations
* Admin dashboard development
* Responsive UI development
* API and backend integration
* Production deployment
* Managing environment variables and secrets

---

## Future Improvements

Possible future improvements include:

* Product reviews and ratings
* Wishlist functionality
* Advanced product filtering
* Coupon and discount system
* Inventory alerts
* More advanced analytics
* Email order confirmations
* Improved search functionality
* Product recommendation system

---

## Deployment

The application is deployed using **Firebase Hosting**.

**Production:**
https://novara-7b539.web.app

---

## Author

**Mehedi Hasan Topu**

Full Stack Web Developer

* GitHub: https://github.com/topu9872-cpu
* Portfolio: https://topudev.vercel.app
* LinkedIn: https://www.linkedin.com/in/mehedi-hasan-topu/

---

## License

This project is created for learning, portfolio, and demonstration purposes.
