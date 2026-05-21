# LifeOS AI

LifeOS AI is a full-stack personal life management system for goals, habits, expenses, studies, and productivity.

## Stack

- Frontend: Next.js, React, Tailwind CSS, Framer Motion, Recharts
- Backend: Node.js, Express, MongoDB, JWT
- Charts: Recharts

## Folder Structure

- `apps/web` - Next.js dashboard UI
- `apps/api` - Express API, MongoDB models, JWT auth

## Quick Start

1. Install dependencies.

```bash
npm install
```

2. Create environment files.

- `apps/api/.env` from `apps/api/.env.example`
- `apps/web/.env.local` from `apps/web/.env.example`

3. Run both apps.

```bash
npm run dev
```

The API now requires a live MongoDB instance. If `MONGODB_URI` is not set or the database is offline, the backend will exit on startup.

## Environment Variables

### API

- `PORT` - Express port, default `4000`
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `CLIENT_URL` - Frontend origin for CORS

### Web

- `NEXT_PUBLIC_API_URL` - API base URL, default `http://localhost:4000/api`

## Features

- Signup/login with JWT
- User profile and dashboard overview
- Goals, habits, expenses, and study planner modules
- Productivity analytics and AI recommendations
- Dark/light mode and responsive sidebar layout

## API Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard/summary`
- `GET /api/dashboard/insights`
- `GET /api/goals`, `POST /api/goals`, `GET /api/goals/:id`, `PUT /api/goals/:id`, `PATCH /api/goals/:id`, `DELETE /api/goals/:id`
- `GET /api/habits`, `POST /api/habits`, `GET /api/habits/:id`, `PUT /api/habits/:id`, `PATCH /api/habits/:id`, `DELETE /api/habits/:id`
- `GET /api/expenses`, `POST /api/expenses`, `GET /api/expenses/:id`, `PUT /api/expenses/:id`, `PATCH /api/expenses/:id`, `DELETE /api/expenses/:id`
- `GET /api/study`, `POST /api/study`, `GET /api/study/:id`, `PUT /api/study/:id`, `PATCH /api/study/:id`, `DELETE /api/study/:id`

## Sample Request Bodies

### Signup

```json
{
	"name": "Avery Johnson",
	"email": "avery@example.com",
	"password": "Password123!"
}
```

### Goal

```json
{
	"title": "Launch personal portfolio",
	"description": "Publish case studies and contact page.",
	"timeframe": "monthly",
	"progress": 42,
	"milestones": [
		{ "title": "Finish layout", "completed": true },
		{ "title": "Add project content", "completed": false }
	],
	"dueDate": "2026-06-30T00:00:00.000Z"
}
```

### Habit

```json
{
	"title": "Morning meditation",
	"frequency": "daily",
	"streak": 21,
	"history": [true, true, true, false, true, true, true],
	"color": "#0ea5e9"
}
```

### Expense

```json
{
	"title": "Groceries",
	"amount": 86,
	"type": "expense",
	"category": "food",
	"date": "2026-05-08T00:00:00.000Z",
	"notes": "Weekly grocery run"
}
```

### Study Task

```json
{
	"subject": "Advanced React",
	"deadline": "2026-06-14T00:00:00.000Z",
	"progress": 74,
	"examReminderAt": "2026-06-12T00:00:00.000Z",
	"notes": "Focus on server actions and state management."
}
```

## Notes

The frontend still includes local mock fallbacks for demo viewing, but the backend persistence layer now reads and writes real MongoDB data. Connect a MongoDB instance and replace the sample credentials before production use.