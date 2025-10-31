# Lock In Local API (MySQL)

This is a lightweight Express server that connects to your existing MySQL database and exposes minimal endpoints:

- GET /users
- POST /add_user
- GET /goals?userId=USER_ID
- POST /goals
- DELETE /goals/:id

It expects an existing MySQL schema:

- User(UserID, Name, Email, Password)
- Goal(GoalID, Title, Description, DueDate, UserID → FK User)

## Setup

1) Copy .env.example to .env and fill in your local MySQL credentials

```
cp server/.env.example server/.env
```

2) Install and run

```
cd server
npm install
npm start
```

By default the API runs at http://localhost:3001 and is CORS-allowed for the Vite dev server (http://localhost:8080).
