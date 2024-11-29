CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100),
    password_hash VARCHAR(255),
    google_id VARCHAR(255)
);

CREATE TABLE budgets (
    budget_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    category_name VARCHAR(100) NOT NULL,
    initial_amount DECIMAL(10, 2) NOT NULL,
    remaining_amount DECIMAL(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    budget_id INT REFERENCES budgets(budget_id),
    amount DECIMAL(10, 2) NOT NULL,
    merchant_name VARCHAR(255),
    transaction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    transaction_type VARCHAR(50) CHECK (transaction_type IN ('EXPENSE', 'INCOME'))
);

CREATE TABLE savings_goals (
    goal_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    goal_name VARCHAR(100) NOT NULL,
    target_amount DECIMAL(10, 2) NOT NULL,
    current_amount DECIMAL(10, 2) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50)  CHECK (status IN ('ACTIVE', 'COMPLETED', 'CANCELLED'))
);

CREATE TABLE user_preferences (
    preference_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    currency VARCHAR(10) DEFAULT 'USD',
    receive_notifications BOOLEAN DEFAULT TRUE,
    country_code VARCHAR(2) NOT NULL CHECK (country_code IN (
        'US', 'GB', 'ES', 'NL', 'FR', 'IE', 'CA', 'DE', 
        'IT', 'PL', 'DK', 'NO', 'SE', 'EE', 'LT', 'LV', 'PT', 'BE'
    ))
);

CREATE TABLE plaid_accounts (
    plaid_account_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    access_token VARCHAR(255) NOT NULL,  
    account_id VARCHAR(100) NOT NULL,    
    institution_name VARCHAR(255),       
    account_type VARCHAR(50),            
    current_balance DECIMAL(10, 2),      
    currency VARCHAR(10) DEFAULT 'USD'
);

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY, 
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL CHECK(type IN ('NEW_TRANSACTIONS', 'OVER_BUDGET_ALERT', 'LARGE_TRANSACTION_ALERT','SALARY_RECEIVED','UNASSIGNED_TRANSACTIONS')),                                         
    title VARCHAR(50) NOT NULL,                                        
    message VARCHAR(255) NOT NULL,                                      
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,             
    read BOOLEAN DEFAULT FALSE                                 
);

CREATE TABLE notification_users (
    item_id TEXT PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE
);