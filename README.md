# School Management API

A robust Node.js/Express API to manage schools and calculate distance. Supports both **MySQL** and **Neon PostgreSQL**.

## Live Deployment & Documentation

- **Live URL**: [https://cautious-ermengarde-arya007-0f824957.koyeb.app](https://cautious-ermengarde-arya007-0f824957.koyeb.app)
- **Interactive API Docs (Swagger)**: [https://cautious-ermengarde-arya007-0f824957.koyeb.app/api-docs](https://cautious-ermengarde-arya007-0f824957.koyeb.app/api-docs)
- **Example Endpoint**: [https://cautious-ermengarde-arya007-0f824957.koyeb.app/api/schools/all](https://cautious-ermengarde-arya007-0f824957.koyeb.app/api/schools/all)

_Note: The application is deployed on Koyeb and is kept awake (prevented from sleeping) by a GitHub Actions workflow that pings the server every 30 minutes._

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in credentials.
3. `npm run init-db` (initializes tables based on chosen DB)
4. `npm run dev`
5. Visit `http://localhost:3000/api-docs` to view the local Swagger documentation.

## .env Structure

```
PORT=3000
DB_TYPE=mysql # or 'neon'

# MySQL connection string
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=school_db

# Neon (PostgreSQL) connection string
# DATABASE_URL=postgresql://user:password@hostname.neon.tech/dbname?sslmode=require
```

## API Queries

### Add School

```bash
curl -X POST http://localhost:3000/api/schools/addSchool \
-H "Content-Type: application/json" \
-d '{"name":"Springfield High","address":"123 Main St","latitude":40.7128,"longitude":-74.006,"established_year":1990}'
```

### List Schools Sorted by Distance

```bash
curl "http://localhost:3000/api/schools/listSchools?latitude=40.7&longitude=-74.0"
```

### Get All Schools

```bash
curl "http://localhost:3000/api/schools/all"
```

### Get School by ID

```bash
curl "http://localhost:3000/api/schools/1"
```

### Update School Status

```bash
curl -X PATCH http://localhost:3000/api/schools/1/status \
-H "Content-Type: application/json" \
-d '{"status":"inactive"}'
```

### Delete School

```bash
curl -X DELETE "http://localhost:3000/api/schools/1"
```

## Postman Collection

A fully configured Postman collection is included. 
- **Local File:** Import the file located at [`postman/School Management API.postman_collection.json`](postman/School%20Management%20API.postman_collection.json) into your Postman client.
- **Shared Link:** You can also download/view the collection directly from the repository.
