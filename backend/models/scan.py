from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    input_type = Column(String(50), nullable=False)  # 'email' or 'url'
    input_content = Column(Text, nullable=False)
    result = Column(String(50), nullable=False)      # 'legitimate', 'suspicious', 'phishing'
    risk_score = Column(Float, nullable=False)       # confidence / risk probability 0.0-1.0
    details = Column(Text, nullable=True)            # JSON metadata for explanation / indicators
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
