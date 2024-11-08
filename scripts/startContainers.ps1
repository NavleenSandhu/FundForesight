# Step 1: Start the PostgreSQL container
docker run --name postgres `
    -e POSTGRES_PASSWORD=root `
    -e POSTGRES_DB=fund_foresight `
    -p 5433:5432 `
    --network fund-foresight `
    -d postgres

# Step 2: Wait for PostgreSQL to be fully up
Start-Sleep -Seconds 5

# Step 3: Apply the database schema
Get-Content ..\backend\data\schema.sql | docker exec -i postgres psql -U postgres -d fund_foresight

# Step 4: Start the budget-service container
docker run --name budget-service `
    --network fund-foresight `
    -d -p 6000:6000 `
    --env-file ../backend/budgets/.env budget-service
