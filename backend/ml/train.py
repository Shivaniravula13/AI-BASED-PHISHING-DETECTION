import os
import re
import json
import joblib
import pandas as pd
import numpy as np
import nltk

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

from xgboost import XGBClassifier

# Download required NLTK datasets
try:
    nltk.download('stopwords', quiet=True)
    nltk.download('wordnet', quiet=True)
    nltk.download('punkt', quiet=True)
    from nltk.corpus import stopwords
    from nltk.stem import WordNetLemmatizer
    from nltk.tokenize import word_tokenize
    NLTK_AVAILABLE = True
except Exception as e:
    print(f"NLTK setup warning: {e}. Using fallback preprocessing.")
    NLTK_AVAILABLE = False

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASETS_DIR = os.path.join(BASE_DIR, "..", "datasets")
EMAILS_CSV = os.path.join(DATASETS_DIR, "emails.csv")
URLS_CSV = os.path.join(DATASETS_DIR, "urls.csv")

# Cleanup helper
def preprocess_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    # Remove special chars but keep email/url signs loosely for tfidf
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    if NLTK_AVAILABLE:
        try:
            tokens = word_tokenize(text)
            stop_words = set(stopwords.words('english'))
            lemmatizer = WordNetLemmatizer()
            cleaned_tokens = [lemmatizer.lemmatize(w) for w in tokens if w not in stop_words]
            return " ".join(cleaned_tokens)
        except Exception:
            pass
            
    # Fallback preprocessing
    words = text.split()
    fallback_stops = {'the', 'and', 'to', 'of', 'in', 'is', 'that', 'it', 'for', 'you', 'on', 'this', 'with', 'be', 'are', 'your', 'my', 'our', 'a', 'an'}
    cleaned = [w for w in words if w not in fallback_stops]
    return " ".join(cleaned)

def train_email_models():
    print("\n--- Training Email Models ---")
    if not os.path.exists(EMAILS_CSV):
        raise FileNotFoundError(f"Email dataset not found at {EMAILS_CSV}")
        
    df = pd.read_csv(EMAILS_CSV)
    print(f"Loaded {len(df)} emails.")
    
    # Preprocess texts
    print("Preprocessing email texts...")
    df['Clean Text'] = df['Email Text'].apply(preprocess_text)
    
    # Convert labels: legitimate -> 0, phishing -> 1
    df['label_num'] = df['Label'].map({'legitimate': 0, 'phishing': 1})
    
    # Vectorizer
    print("Extracting TF-IDF features...")
    vectorizer = TfidfVectorizer(max_features=5000)
    X = vectorizer.fit_transform(df['Clean Text'])
    y = df['label_num'].values
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1),
        "XGBoost": XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42, n_jobs=-1)
    }
    
    metrics = {}
    best_model_name = None
    best_f1 = -1
    best_model = None
    
    for name, model in models.items():
        print(f"Training {name}...")
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        
        acc = accuracy_score(y_test, preds)
        prec = precision_score(y_test, preds)
        rec = recall_score(y_test, preds)
        f1 = f1_score(y_test, preds)
        
        metrics[name] = {
            "accuracy": float(acc),
            "precision": float(prec),
            "recall": float(rec),
            "f1_score": float(f1)
        }
        
        print(f"[{name}] Acc: {acc:.4f} | Prec: {prec:.4f} | Rec: {rec:.4f} | F1: {f1:.4f}")
        
        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_model = model
            
    print(f"Best Email Model: {best_model_name} with F1-Score {best_f1:.4f}")
    
    # Save the vectorizer and best model
    joblib.dump(vectorizer, os.path.join(BASE_DIR, "email_vectorizer.pkl"))
    joblib.dump(best_model, os.path.join(BASE_DIR, "email_model.pkl"))
    
    return metrics, best_model_name

def train_url_models():
    print("\n--- Training URL Models ---")
    if not os.path.exists(URLS_CSV):
        raise FileNotFoundError(f"URL dataset not found at {URLS_CSV}")
        
    df = pd.read_csv(URLS_CSV)
    print(f"Loaded {len(df)} URLs.")
    
    # Features: URL Length, HTTPS, Special Characters
    X = df[['URL Length', 'HTTPS', 'Special Characters']].values
    y = df['Label'].map({'legitimate': 0, 'phishing': 1}).values
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    models = {
        "Logistic Regression": LogisticRegression(),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1),
        "XGBoost": XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42, n_jobs=-1)
    }
    
    metrics = {}
    best_model_name = None
    best_f1 = -1
    best_model = None
    
    for name, model in models.items():
        print(f"Training {name}...")
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        
        acc = accuracy_score(y_test, preds)
        prec = precision_score(y_test, preds)
        rec = recall_score(y_test, preds)
        f1 = f1_score(y_test, preds)
        
        metrics[name] = {
            "accuracy": float(acc),
            "precision": float(prec),
            "recall": float(rec),
            "f1_score": float(f1)
        }
        
        print(f"[{name}] Acc: {acc:.4f} | Prec: {prec:.4f} | Rec: {rec:.4f} | F1: {f1:.4f}")
        
        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_model = model
            
    print(f"Best URL Model: {best_model_name} with F1-Score {best_f1:.4f}")
    
    # Save best model
    joblib.dump(best_model, os.path.join(BASE_DIR, "url_model.pkl"))
    
    return metrics, best_model_name

def main():
    email_metrics, best_email_model = train_email_models()
    url_metrics, best_url_model = train_url_models()
    
    # Save combined report
    report = {
        "email_models": email_metrics,
        "best_email_model": best_email_model,
        "url_models": url_metrics,
        "best_url_model": best_url_model
    }
    
    report_path = os.path.join(BASE_DIR, "model_metrics.json")
    with open(report_path, "w") as f:
        json.dump(report, f, indent=4)
        
    print(f"\nTraining pipeline complete! Report saved to {report_path}")

if __name__ == "__main__":
    main()
