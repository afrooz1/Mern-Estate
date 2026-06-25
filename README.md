# Real Estate MERN Application

A full-stack Real Estate web application built using the MERN stack. 
Users can create accounts, sign in with email/password or Google OAuth, manage their profiles, create property listings,
edit listings, and browse available properties.

## Features

### Authentication & Authorization

* User Registration
* User Login
* JWT Authentication
* Secure HTTP-only Cookies
* Google OAuth Login with Firebase
* User Logout

### User Profile Management

* Update Username
* Update Email
* Update Password
* Upload Profile Picture
* Delete Account

### Property Listings

* Create Listings
* Update Listings
* Delete Listings
* View Individual Listings
* View User Listings
* Rent & Sale Property Support

### Search & Filtering

* Search Properties
* Filter by Type
* Filter by Offer Status
* Sort Listings

### State Management

* Redux Toolkit
* Redux Persist

### Security

* Password Hashing using bcryptjs
* JWT-based Authentication
* Protected Routes
* HTTP-only Authentication Cookies

---

## Tech Stack

### Frontend

* React
* React Router DOM
* Redux Toolkit
* Redux Persist
* Tailwind CSS
* Firebase Authentication

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs

### Authentication

* Firebase Google OAuth
* JWT Authentication

---

## Project Structure

```bash
real-estate-app/
│
├── api/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── firebase.js
│   │   └── App.jsx
│   │
│   └── public/
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/Mern-Estate.git
cd Mern-Estate
```

### Backend Setup

```bash
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Start backend server:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file:

```env
VITE_FIREBASE_API=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Start frontend:

```bash
npm run dev
```

---

## Future Improvements

* Cloudinary Image Upload
* Favorites / Wishlist
* Property Reviews
* Real-Time Chat
* Admin Dashboard
* Property Location Maps
* Email Verification
* Password Reset

---

## Author
Afrooz Habib


