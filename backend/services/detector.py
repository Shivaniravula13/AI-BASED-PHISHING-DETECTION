import os
import re
import joblib
import pandas as pd
import numpy as np

# Use the same preprocessing function
from ml.train import preprocess_text

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ML_DIR = os.path.join(BASE_DIR, "..", "ml")

# Global variables for loaded models
EMAIL_MODEL = None
EMAIL_VECTORIZER = None
URL_MODEL = None

def load_models():
    global EMAIL_MODEL, EMAIL_VECTORIZER, URL_MODEL
    try:
        email_model_path = os.path.join(ML_DIR, "email_model.pkl")
        email_vec_path = os.path.join(ML_DIR, "email_vectorizer.pkl")
        url_model_path = os.path.join(ML_DIR, "url_model.pkl")
        
        if os.path.exists(email_model_path) and os.path.exists(email_vec_path):
            EMAIL_MODEL = joblib.load(email_model_path)
            EMAIL_VECTORIZER = joblib.load(email_vec_path)
            print("Loaded Email Phishing Model and Vectorizer successfully.")
        else:
            print("Warning: Email model or vectorizer file not found.")
            
        if os.path.exists(url_model_path):
            URL_MODEL = joblib.load(url_model_path)
            print("Loaded URL Phishing Model successfully.")
        else:
            print("Warning: URL model file not found.")
    except Exception as e:
        print(f"Error loading model weights: {e}")

# Initial load on import
load_models()

# Phishing text indicators
PHISHING_INDICATORS = {
    r"\burgent\b": "Urgent/Time-pressured language",
    r"\bverify\b": "Verification or credential confirmation request",
    r"\bsuspend(ed)?\b": "Account suspension threat",
    r"\bpassword\b": "Password related request",
    r"\blogin\b": "Request to log in via external link",
    r"\bclick here\b": "Call-to-action link ('click here')",
    r"\brefund\b": "Tax or financial refund claim",
    r"\bwon\b|\bprize\b|\bcongratulations\b": "Lottery/prize/win announcement",
    r"\bcard ending\b|\bblocked\b": "Credit card blocking alert",
    r"\binvoice\b|\boverdue\b": "Overdue payment or billing invoice claim",
    r"\bbank\b|\bpaypal\b": "Impersonation of a financial service",
    r"\bbitcoin\b|\bcrypto\b": "Cryptocurrency transaction request",
}

def analyze_email_text(text: str):
    global EMAIL_MODEL, EMAIL_VECTORIZER
    if EMAIL_MODEL is None or EMAIL_VECTORIZER is None:
        # Reload attempt
        load_models()
        if EMAIL_MODEL is None or EMAIL_VECTORIZER is None:
            # Fallback mock detector if model training didn't complete
            is_phish = any(re.search(pat, text.lower()) for pat in PHISHING_INDICATORS.keys())
            score = 0.85 if is_phish else 0.05
            return "phishing" if is_phish else "legitimate", score, ["Suspicious keywords matching mock rules"]
            
    # Process
    cleaned = preprocess_text(text)
    features = EMAIL_VECTORIZER.transform([cleaned])
    
    # Predict
    pred_label_num = EMAIL_MODEL.predict(features)[0]
    prob = EMAIL_MODEL.predict_proba(features)[0]
    confidence = float(prob[1] if pred_label_num == 1 else prob[0])
    
    label = "phishing" if pred_label_num == 1 else "legitimate"
    
    # Extract indicators
    indicators = []
    text_lower = text.lower()
    for pattern, explanation in PHISHING_INDICATORS.items():
        if re.search(pattern, text_lower):
            indicators.append(explanation)
            
    if label == "phishing" and not indicators:
        indicators.append("Unusual phrasing patterns detected by ML classifier")
        
    return label, confidence, indicators

def analyze_url_string(url: str):
    global URL_MODEL
    if URL_MODEL is None:
        load_models()
        if URL_MODEL is None:
            # Fallback mock detector
            is_phish = any(x in url for x in ["login", "verify", "secure", "update", "paypal", "chase"])
            score = 0.90 if is_phish else 0.05
            return "phishing" if is_phish else "legitimate", score, ["Domain lookup matches mock rule triggers"]
            
    # Extract features matching dataset: URL Length, HTTPS, Special Characters
    length = len(url)
    https = 1 if url.lower().startswith("https://") else 0
    special_chars = sum(url.count(char) for char in ["-", ".", "_", "?", "=", "&", "@", "%"])
    
    features = np.array([[length, https, special_chars]])
    
    # Predict
    pred_label_num = URL_MODEL.predict(features)[0]
    prob = URL_MODEL.predict_proba(features)[0]
    confidence = float(prob[1] if pred_label_num == 1 else prob[0])
    
    label = "phishing" if pred_label_num == 1 else "legitimate"
    
    # Analyze threat metrics
    indicators = []
    if length > 75:
        indicators.append(f"Excessively long URL ({length} characters)")
    if https == 0:
        indicators.append("Unsecured communication protocol (HTTP instead of HTTPS)")
    if special_chars > 5:
        indicators.append(f"High number of special characters ({special_chars} characters)")
    if any(kw in url.lower() for kw in ["secure", "update", "verify", "login", "signin", "account"]):
        indicators.append("URL contains credential harvesting bait words (e.g. login, verify, secure)")
        
    # Classify suspicious if not fully phishing but having warning signs
    if label == "legitimate" and len(indicators) >= 2:
        label = "suspicious"
        confidence = 0.65
        
    return label, confidence, indicators
