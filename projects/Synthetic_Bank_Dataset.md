# Synthetic Bank Dataset

![Cover Image](../assets/images/projects/Synthetic_Bank_Dataset.jpg)

## About

This dataset is for learning and test. It simulate a bank with branchs in **Melbourne** and **Sydney**. Dataset include **customers, accounts, loans, transactions** and branches.  

You can change **year** in script to generate dataset for other years.

## Data Flow Diagram

Branches → Customers → Accounts → Transactions
                 ↘
                  Loans

- **Branches**: bank offices in Melbourne & Sydney  
- **Customers**: people belong to branch  
- **Accounts**: each customer have 1+ account  
- **Loans**: customers may have 0+ loans  
- **Transactions**: each account have many transactions  

Example:
```markdown

Branch BR001 (Melbourne)
   │
   ├── Customer CUST000001
   │       ├── Account ACC0000001
   │       │      ├── Transaction TX00000001
   │       │      ├── Transaction TX00000002
   │       │
   │       └── Loan LN000001
   │
   └── Customer CUST000002
           ├── Account ACC0000002
           └── Loan LN000002
```

## Files and Columns

### 1. branches.csv
- `branch_code` → unique branch id  
- `branch_name` → branch name  
- `city` → Melbourne or Sydney  
- `region` → region name  
- `manager_id` → branch manager id  
- `open_date` → branch open date  
- `branch_status` → active or closed  
- `latitude` → GPS latitude  
- `longitude` → GPS longitude  

### 2. customers.csv
- `customer_id` → unique customer id  
- `first_name` → first name  
- `last_name` → last name  
- `dob` → date of birth  
- `gender` → M or F  
- `national_id` → fake national id  
- `email` → email  
- `phone_number` → phone number  
- `kyc_status` → verified or unverified  
- `account_open_date` → first account date  
- `customer_segment` → retail, corporate, premium  
- `branch_code` → branch customer belong  

### 3. accounts.csv
- `account_id` → unique account id  
- `customer_id` → link to customer  
- `account_type` → savings, current, credit  
- `currency` → always AUD  
- `balance` → account balance  
- `branch_code` → branch of account  
- `account_status` → active, closed, frozen  
- `created_at` → account open date  
- `closed_at` → if account closed  

### 4. loans.csv
- `loan_id` → unique loan id  
- `customer_id` → link to customer  
- `loan_type` → personal, mortgage, auto  
- `principal_amount` → loan amount  
- `interest_rate` → interest %  
- `loan_term_months` → loan duration in month  
- `start_date` → loan start date  
- `end_date` → loan end date  
- `payment_frequency` → monthly or quarterly  
- `loan_status` → active, closed, defaulted  
- `past_due_amount` → overdue amount  

### 5. transactions.parquet
- `transaction_id` → unique transaction id  
- `account_id` → link to account  
- `transaction_type` → deposit, withdrawal, transfer, payment  
- `amount` → transaction amount  
- `currency` → AUD, sometimes USD/EUR  
- `transaction_date` → transaction date  
- `branch_code` → branch  
- `merchant_category` → category like retail, grocery, travel…  
- `status` → completed, failed, pending  

## Usage

- You can load **CSV** with pandas or polars  
- Transactions is **Parquet**, recommended use **polars** or **dask**  
- Script allow you set **year** and generate new dataset  

## Note

- This dataset is **synthetic**, not real peoples  
- Dates, amount, patterns are random but realistic  
- Good for testing **ETL, analytics, data quality** projects  
