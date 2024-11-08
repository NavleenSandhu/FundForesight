
# PostgreSQL Schema for SmartBudget App

## 1. Users Table
Stores user-specific data.

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100),
    password_hash VARCHAR(255),
    google_id VARCHAR(255)
);
```

## 2. Budget Table
Tracks the user’s budgets for different categories and periods (e.g., monthly).

```sql
CREATE TABLE budgets (
    budget_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    initial_amount DECIMAL(10, 2) NOT NULL,
    remaining_amount DECIMAL(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);
```

## 3. Transactions Table
Logs all financial transactions, with relationships to users and budgets.

```sql
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    budget_id INT REFERENCES budgets(budget_id),
    amount DECIMAL(10, 2) NOT NULL,
    transaction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    transaction_type VARCHAR(50) CHECK (transaction_type IN ('EXPENSE', 'INCOME'))
);
```

## 4. Savings Goals Table
Stores information about users' savings goals.

```sql
CREATE TABLE savings_goals (
    goal_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    goal_name VARCHAR(100) NOT NULL,
    target_amount DECIMAL(10, 2) NOT NULL,
    current_amount DECIMAL(10, 2) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50) CHECK (status IN ('active', 'completed', 'cancelled'))
);
```

## 5. User Preferences Table
Stores individual user settings and preferences, such as currency, preferred budget period, and notification settings.

```sql
CREATE TABLE user_preferences (
    preference_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    currency VARCHAR(10) DEFAULT 'USD',
    receive_notifications BOOLEAN DEFAULT TRUE
);
```

## 6. Accounts Table

```sql
CREATE TABLE plaid_accounts (
    plaid_account_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    access_token VARCHAR(255) NOT NULL,  
    account_id VARCHAR(100) NOT NULL,    
    institution_name VARCHAR(255),       
    account_type VARCHAR(50),            
    current_balance DECIMAL(10, 2),      
    available_balance DECIMAL(10, 2),    
    currency VARCHAR(10) DEFAULT 'USD'
);
```