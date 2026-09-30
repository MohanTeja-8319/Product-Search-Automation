# Product Search Automation (Comparely)

An intelligent multi-store product search, price tracking, and automated comparison platform. Compare live prices across top e-commerce platforms (Amazon, Flipkart, Myntra, etc.), set custom price drop alerts, track historical trends, and manage administrative settings.

---

## 📁 Project Structure

```text
SE_Project/
├── backend/                  # Node.js + Express REST API
│   ├── controllers/          # Route handlers (auth, alerts, push, admin, products)
│   ├── middleware/           # Auth and validation middleware
│   ├── models/               # MongoDB Mongoose schemas (User, Alert, PushSubscription)
│   ├── routes/               # Express API routes
│   ├── services/             # SerpAPI & external commerce scraping/search services
│   ├── utils/                # Helper utilities (email notifications, web-push)
│   ├── .env.example          # Environment variables template
│   ├── package.json          # Backend dependencies
│   └── server.js             # Server entry point
│
├── frontend/                 # React 19 + Vite + Tailwind CSS SPA
│   ├── public/               # Static assets, logos, and Service Worker (sw.js)
│   ├── src/
│   │   ├── admin/            # Admin dashboard, logs, analytics, and management views
│   │   ├── Components/       # Reusable UI components (Navbar, Sidebar, SearchBar, etc.)
│   │   ├── hooks/            # Custom React hooks (useWindowSize, etc.)
│   │   ├── Pages/            # Main application views (Home, Search, Compare, Alerts, Settings)
│   │   ├── utils/            # API client, push helpers, theme managers
│   │   ├── App.jsx           # Root application router
│   │   ├── index.css         # Global styling and design system
│   │   └── main.jsx          # React DOM entry point
│   ├── .env.example          # Frontend environment variables template
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
│
├── .gitignore                # Root gitignore for fullstack repository
├── package.json              # Root package scripts for fullstack orchestration
└── README.md                 # Project documentation
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18.x or later
- **MongoDB**: Local MongoDB instance or MongoDB Atlas cluster URI
- **SerpAPI / E-Commerce API Key** (optional for live search scraping)

---

### 2. Environment Setup

#### Backend Setup
Navigate to `backend` and create your `.env` file from `.env.example`:
```bash
cd backend
cp .env.example .env
```
Configure your credentials in `backend/.env`:
- `PORT=5000`
- `MONGODB_URI=your_mongodb_connection_string`
- `JWT_SECRET=your_jwt_secret_key`
- `CLIENT_ORIGIN=http://localhost:5173`
- `SERPAPI_KEY=your_serpapi_key` *(optional for live search)*

#### Frontend Setup
Navigate to `frontend` and create your `.env` file:
```bash
cd ../frontend
cp .env.example .env
```
Ensure `VITE_API_URL` points to your backend:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 3. Installation & Running

From the root directory (`SE_Project`):

#### Install All Dependencies
```bash
npm run install:all
```

#### Run Development Servers
- **Run Backend**:
  ```bash
  npm run dev:backend
  ```
  Backend runs at: `http://localhost:5000` (Health check: `http://localhost:5000/api/health`)

- **Run Frontend**:
  ```bash
  npm run dev:frontend
  ```
  Frontend runs at: `http://localhost:5173`

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, React Router v7, React Icons, React Hot Toast
- **Backend**: Node.js, Express 4, MongoDB & Mongoose, JSON Web Tokens (JWT), Bcrypt.js, Web-Push, Nodemailer
- **Search & Comparison**: SerpAPI integration with multi-source fallback and normalizer

---

## 🔐 Git & Contribution Workflow

1. Keep `.env` files untracked. Only commit `.env.example` templates.
2. Ensure production builds succeed prior to pushing:
   ```bash
   npm run build:frontend
   ```
3. Test backend syntax:
   ```bash
   node --check backend/server.js
   ```
