import json
import jwt
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, HttpUrl

from database import get_db
from models.scan import Scan
from models.user import User
from services.auth import get_current_user
from services.detector import analyze_email_text, analyze_url_string
from config import Config

router = APIRouter(prefix="/api/predict", tags=["Detection"])

class EmailPredictionRequest(BaseModel):
    email_text: str

class UrlPredictionRequest(BaseModel):
    url: str

def get_optional_user(request: Request, db: Session = Depends(get_db)) -> User | None:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, Config.SECRET_KEY, algorithms=[Config.ALGORITHM])
        email = payload.get("sub")
        return db.query(User).filter(User.email == email).first()
    except Exception:
        return None

@router.post("/email")
def predict_email(data: EmailPredictionRequest, db: Session = Depends(get_db), current_user: User = Depends(get_optional_user)):
    if not data.email_text.strip():
        raise HTTPException(status_code=400, detail="Email content cannot be empty")
        
    result, confidence, indicators = analyze_email_text(data.email_text)
    
    # Calculate threat risk level
    if result == "phishing":
        risk_level = "High" if confidence > 0.8 else "Medium"
    else:
        risk_level = "Low"
        
    response = {
        "prediction": result,
        "confidence": confidence,
        "risk_level": risk_level,
        "indicators": indicators,
        "input_content": data.email_text
    }
    
    # Log scan
    scan_log = Scan(
        user_id=current_user.id if current_user else None,
        input_type="email",
        input_content=data.email_text[:1000],  # Truncate content in db index
        result=result,
        risk_score=confidence,
        details=json.dumps(response)
    )
    db.add(scan_log)
    db.commit()
    
    return response

@router.post("/url")
def predict_url(data: UrlPredictionRequest, db: Session = Depends(get_db), current_user: User = Depends(get_optional_user)):
    url_str = data.url.strip()
    if not url_str:
        raise HTTPException(status_code=400, detail="URL cannot be empty")
        
    # Standardize protocol if not present for basic regex
    if not url_str.lower().startswith(("http://", "https://")):
        url_str = "http://" + url_str
        
    result, confidence, indicators = analyze_url_string(url_str)
    
    # Map risk levels
    if result == "phishing":
        risk_level = "High"
    elif result == "suspicious":
        risk_level = "Medium"
    else:
        risk_level = "Low"
        
    response = {
        "prediction": result,
        "confidence": confidence,
        "risk_level": risk_level,
        "indicators": indicators,
        "input_content": data.url
    }
    
    # Log scan
    scan_log = Scan(
        user_id=current_user.id if current_user else None,
        input_type="url",
        input_content=data.url,
        result=result,
        risk_score=confidence,
        details=json.dumps(response)
    )
    db.add(scan_log)
    db.commit()
    
    return response

@router.get("/history")
def get_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    scans = db.query(Scan).filter(Scan.user_id == current_user.id).order_name_by = Scan.created_at.desc()
    # Or just standard ordering
    scans = db.query(Scan).filter(Scan.user_id == current_user.id).order_by(Scan.created_at.desc()).limit(50).all()
    
    history = []
    for s in scans:
        try:
            details_dict = json.loads(s.details) if s.details else {}
        except Exception:
            details_dict = {}
            
        history.append({
            "id": s.id,
            "input_type": s.input_type,
            "input_content": s.input_content,
            "result": s.result,
            "risk_score": s.risk_score,
            "created_at": s.created_at,
            "details": details_dict
        })
    return history
