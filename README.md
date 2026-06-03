# PhishGuard AI – Full Stack Phishing Detection System

PhishGuard AI is a production-ready, highly aesthetic cybersecurity-themed web application that detects phishing emails, suspicious URLs, and live text input using Machine Learning (Random Forest, XGBoost, Logistic Regression) and Natural Language Processing (NLP).

## 🚀 Key Features

*   **Cybersecurity-Themed Landing Page**: Futuristic dark mode with glassmorphic cards and live threat logs metrics.
*   **Optional & Authenticated Operations**: Standard JWT session keys with encrypted DB hashing (bcrypt).
*   **Email Analyzer**: Processes text using custom NLP (tokenization, stopword filtering) and tf-idf mapping.
*   **URL Profiler**: Parses URL structural details (lengths, protocol check, special character weights) and displays a color-shifting threat meter.
*   **Real-time Typing Sandbox**: Inspects keystrokes dynamically using a debounced event interceptor.
*   **Admin Panel**: Controls user registries, outputs CSV scan exports, logs ML training history, and triggers in-memory model retraining hot-reloads.

---

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), Tailwind CSS v4, Axios, React Router v6, Chart.js & React-Chartjs-2.
*   **Backend**: Python, FastAPI, REST APIs, SQLAlchemy.
*   **Database**: SQLite (default zero-configuration) and MySQL compatible.
*   **AI/ML**: Scikit-learn, XGBoost, Pandas, NumPy, NLTK, Joblib.

---

## 📂 Project Structure

```text
phishguard-ai/
├── backend/
│   ├── datasets/            # Generated datasets (emails.csv, urls.csv)
│   ├── ml/                  # ML Pipeline (dataset_generator.py, train.py, model pickles)
│   ├── models/              # SQLAlchemy Database Models (user.py, scan.py, ml_metrics.py)
│   ├── routes/              # FastAPI Routers (auth.py, detection.py, dashboard.py, admin.py)
│   ├── services/            # Business Logic (auth.py, detector.py)
│   ├── database.py          # SQLAlchemy Session Provider
│   ├── config.py            # System Configuration
│   ├── main.py              # Server Entrypoint
│   └── requirements.txt     # Python Dependencies
├── database/
│   └── schema.sql           # Raw Database Schema
├── frontend/
│   ├── src/
│   │   ├── components/      # UI Layouts (Navbar.jsx, Footer.jsx)
│   │   ├── pages/           # Pages (Landing, Dashboard, EmailScan, UrlScan, RealTimeScan, Admin)
│   │   ├── services/        # Axios API Client (api.js)
│   │   ├── App.jsx          # Route Manager
│   │   └── main.jsx         # App mounting
│   ├── vite.config.js       # Vite Build & Reverse Proxy Settings
│   └── nginx.conf           # Docker deployment proxy rules
├── docker-compose.yml       # Orchestration file
└── README.md                # System documentation
```

---

## ⚙️ Local Installation Guide

Ensure you have Python 3.10+ and Node.js 18+ installed on your computer.

### Step 1: Clone and Set Up Workspace
Set your terminal directory to the cloned `phishguard-ai` folder.

### Step 2: Initialize & Train the Neural Network
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install python requirements:
   ```bash
   pip install -r requirements.txt
   ```
3. Generate the synthetic training datasets (10,000 emails, 10,000 URLs):
   ```bash
   python ml/dataset_generator.py
   ```
4. Execute the training pipeline to compare models and save the best weights:
   ```bash
   python ml/train.py
   ```
   *(This outputs accuracy reports and creates model pickles inside `backend/ml/`)*.

### Step 3: Run the FastAPI Server
1. From the `backend` folder, start the API server:
   ```bash
   python main.py
   ```
   *(The backend initializes a local SQLite DB `phishguard.db` and runs on `http://localhost:8000`)*.

### Step 4: Run the React Frontend
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Boot the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web app dashboard at `http://localhost:5173`.

---

## 🐳 Docker Deployment

To launch the entire stack (FastAPI server + compiled Nginx React app) in containers:

1. In the root directory, build and start containers:
   ```bash
   docker-compose up --build
   ```
2. The web application is hosted at: `http://localhost:3000`.
3. The API server documentation is accessible at: `http://localhost:8000/docs`.

---

## 📡 API Endpoints List

### Authentication
*   `POST /api/auth/register`: Create user account.
*   `POST /api/auth/login`: Issue JWT access token.

### Scans & Predictions
*   `POST /api/predict/email`: Classify text content. (Returns confidence, risk, and indicators).
*   `POST /api/predict/url`: Classify URL string. (Inspects HTTPS status, special chars, and length).
*   `GET /api/predict/history`: Retrieve logged scan history.

### Dashboard & Analytics
*   `GET /api/dashboard/stats`: Retrieve scan count aggregates.
*   `GET /api/dashboard/analytics`: Retrieve Chart.js graph dataset structures.

### Control Panel (Admin Only)
*   `GET /api/admin/users`: Retrieve operator users list.
*   `GET /api/admin/logs`: Audit system-wide scans.
*   `GET /api/admin/metrics`: Fetch retraining comparison histories.
*   `POST /api/admin/retrain-model`: Execute retraining pipelines and hot-reload weights.
*   `GET /api/admin/export-csv`: Stream download a CSV log database.
