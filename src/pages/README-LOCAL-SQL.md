# Running with Local MySQL (No Cloud)

We added a local API server (Express + MySQL) under `server/` and a frontend API client in `src/lib/api.ts`.

How to run locally:

1) Start the API
```
cd server
cp .env.example .env  # edit with your MySQL password
npm install
npm start
```

2) Run the frontend in another terminal
```
npm run dev
```

The app will call these endpoints on http://localhost:3001:
- GET /users
- POST /add_user
- GET /goals?userId=USER_ID
- POST /goals
- DELETE /goals/:id

We mapped the scheduling flow to create a Goal in your DB and the calendar to read/delete Goals.

Note: Auth still uses the existing in-app mechanism. You can replace it with your own later if you want everything fully local.
