import csv
import io
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from datetime import datetime

from database import get_db
from models.user import User
from models.scan import Scan
from models.ml_metrics import MLMetrics
from services.auth import get_current_admin
from services.detector import load_models

# Import training functions
from ml.train import train_email_models, train_url_models

router = APIRouter(prefix="/api/admin", tags=["Admin Panel"])

@router.get("/users")
def list_users(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "created_at": u.created_at
        }
        for u in users
    ]

@router.get("/logs")
def list_logs(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    logs = db.query(Scan).join(User, Scan.user_id == User.id, isouter=True).order_by(Scan.created_at.desc()).limit(100).all()
    
    return [
        {
            "id": l.id,
            "user_name": l.user.name if l.user else "Anonymous Guest",
            "user_email": l.user.email if l.user else None,
            "input_type": l.input_type,
            "input_content": l.input_content[:200] + "..." if len(l.input_content) > 200 else l.input_content,
            "result": l.result,
            "risk_score": l.risk_score,
            "created_at": l.created_at
        }
        for l in logs
    ]

@router.post("/retrain-model")
def retrain_model(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    try:
        # Run email model training
        email_metrics, best_email = train_email_models()
        # Run URL model training
        url_metrics, best_url = train_url_models()
        
        # Save email model metrics to database
        for algo, stats in email_metrics.items():
            metric_entry = MLMetrics(
                model_type="email",
                algorithm=algo,
                accuracy=stats["accuracy"],
                precision=stats["precision"],
                recall=stats["recall"],
                f1_score=stats["f1_score"],
                is_active=(algo == best_email)
            )
            db.add(metric_entry)
            
        # Save URL model metrics to database
        for algo, stats in url_metrics.items():
            metric_entry = MLMetrics(
                model_type="url",
                algorithm=algo,
                accuracy=stats["accuracy"],
                precision=stats["precision"],
                recall=stats["recall"],
                f1_score=stats["f1_score"],
                is_active=(algo == best_url)
            )
            db.add(metric_entry)
            
        db.commit()
        
        # Hot-reload models in memory
        load_models()
        
        return {
            "status": "success",
            "message": "Models successfully retrained and hot-reloaded in-memory",
            "best_email_model": best_email,
            "best_url_model": best_url,
            "email_metrics": email_metrics,
            "url_metrics": url_metrics
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Retraining failed: {str(e)}"
        )

@router.get("/export-csv")
def export_csv(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    scans = db.query(Scan).join(User, Scan.user_id == User.id, isouter=True).order_by(Scan.created_at.desc()).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write CSV headers
    writer.writerow(["Scan ID", "User Name", "User Email", "Input Type", "Input Content", "Prediction Result", "Risk Score", "Scan Timestamp"])
    
    for s in scans:
        writer.writerow([
            s.id,
            s.user.name if s.user else "Anonymous Guest",
            s.user.email if s.user else "N/A",
            s.input_type,
            s.input_content,
            s.result,
            s.risk_score,
            s.created_at.strftime("%Y-%m-%d %H:%M:%S")
        ])
        
    output.seek(0)
    
    response = StreamingResponse(output, media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename=phishguard_scans_{datetime.now().strftime('%Y%md_%H%M%S')}.csv"
    return response

@router.get("/metrics")
def get_ml_metrics(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    # Retrieve all metrics logs to display retraining comparisons in charts
    metrics = db.query(MLMetrics).order_by(MLMetrics.trained_at.desc()).limit(30).all()
    return [
        {
            "id": m.id,
            "model_type": m.model_type,
            "algorithm": m.algorithm,
            "accuracy": m.accuracy,
            "precision": m.precision,
            "recall": m.recall,
            "f1_score": m.f1_score,
            "is_active": m.is_active,
            "trained_at": m.trained_at
        }
        for m in metrics
    ]
