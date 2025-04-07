# Exabloom Backend

A high-performance messaging backend built with Node.js, Express, Sequelize, and PostgreSQL. Supports fast querying of 5M+ messages with search by name, phone number, and message content.

---

## ⚙️ System Requirements

- **Node.js**: v18 or later (tested on v20+)
- **PostgreSQL**: v13 or later (Postgres.app recommended on macOS)
- **npm**: v8+ (comes with Node)
- **macOS/Linux/WSL** for local development (Windows supported via WSL)

---

## 🚀 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/exabloom-backend.git
cd exabloom-backend
npm install
Create a .env file in the root directory:
DB_HOST=localhost
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=exabloom_db
DB_PORT=5432
Set Up the Database
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```

## Available Endpoints

GET /conversations?page=1 Get 50 most recent conversations
GET /search/:searchValue?page=1 Search by name, number, or message
GET search/searchname/:name?page=1 Search by contact name only
GET search/searchphone/:number?page=1 Search by phone number only

## Assumptions Made

Each conversation is defined by the latest message per contact

Search is done using simple ILIKE string matching

message_content.csv is a valid UTF-8 CSV with a message header

Frontend client will handle pagination UI

## Key Design Decisions

- Used DISTINCT ON SQL for optimal recent-conversation and search performance

- Batched seeding logic to handle large datasets (5M messages) efficiently

- Indexed search-critical columns (name, phoneNumber, content, timestamp)

- Separated concerns into clean route/controller structure for scalability

- Used raw SQL in performance-critical search endpoints
