import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routes import auth, detection, dashboard, admin

# Automatically create SQLAlchemy database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PhishGuard AI API",
    description="Backend API for AI-based phishing detection (emails, URLs, texts)",
    version="1.0.0"
)

# CORS configuration to allow access from Vite React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev simplicity, customize in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(detection.router)
app.include_router(dashboard.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "service": "PhishGuard AI Backend API",
        "version": "1.0.0"
    }

if __name__ == "__main__":
	uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)