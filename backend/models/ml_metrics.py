from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base

class MLMetrics(Base):
    __tablename__ = "ml_metrics"

    id = Column(Integer, primary_key=True, index=True)
    model_type = Column(String(50), nullable=False)  # 'email' or 'url'
    algorithm = Column(String(100), nullable=False)  # 'Logistic Regression', 'Random Forest', 'XGBoost'
    accuracy = Column(Float, nullable=False)
    precision = Column(Float, nullable=False)
    recall = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    is_active = Column(Boolean, default=False)
    trained_at = Column(DateTime(timezone=True), server_default=func.now())
