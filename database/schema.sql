-- PhishGuard AI Database Schema

CREATE DATABASE IF NOT EXISTS phishguard_db;
USE phishguard_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- 2. Scans History Table
CREATE TABLE IF NOT EXISTS scans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    input_type VARCHAR(50) NOT NULL, -- 'email' or 'url'
    input_content TEXT NOT NULL,
    result VARCHAR(50) NOT NULL,     -- 'legitimate', 'suspicious', 'phishing'
    risk_score FLOAT NOT NULL,       -- 0.0 to 1.0 (or percentage)
    details TEXT,                    -- JSON string with explanations/features
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_scans (user_id),
    INDEX idx_created_at (created_at)
);

-- 3. ML Model Metrics Table
CREATE TABLE IF NOT EXISTS ml_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    model_type VARCHAR(50) NOT NULL, -- 'email' or 'url'
    algorithm VARCHAR(100) NOT NULL, -- 'Logistic Regression', 'Random Forest', 'XGBoost'
    accuracy FLOAT NOT NULL,
    `precision` FLOAT NOT NULL,
    recall FLOAT NOT NULL,
    f1_score FLOAT NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    trained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
