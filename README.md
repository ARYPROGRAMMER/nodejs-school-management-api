# School Management API

A robust Node.js/Express API to manage schools and calculate distance.

## Setup
1. `npm install`
2. Create `.env` (use `.env` structure from below)
3. `npm run init-db`
4. `npm run dev`

## .env Structure
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=school_db
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

### Update School Status
```bash
curl -X PATCH http://localhost:3000/api/schools/1/status \
-H "Content-Type: application/json" \
-d '{"status":"inactive"}'
```
