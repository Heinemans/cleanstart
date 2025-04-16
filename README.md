# Rental Management System

⚠️ Node.js versie vereiste
Voor dit project heb je minimaal Node.js v18.17.0 nodig.
Installeer de LTS-versie via: https://nodejs.org/en/download

## 🚀 Snelstarten (Development)

1. `cd backend && npm install`
2. `cd frontend && npm install`
3. Start backend: `npm run dev` in `backend/`
4. Start frontend: `npm run dev` in `frontend/`
5. Ga naar: http://localhost:3000/login  
6. Gebruik testaccount: test@example.com / password123

OF gebruik de geautomatiseerde optie:

1. `npm run install-all`
2. `npm run dev` (start beide servers tegelijk)
3. Ga naar: http://localhost:3000/login
4. Gebruik testaccount: test@example.com / password123

A modern web application for rental management with secure authentication and a clean user interface.

## Project Structure

```
project-root/
├── frontend/ (Next.js 14 with App Router)
│   ├── app/
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx (protected)
│   │   └── layout.tsx
│   ├── components/
│   │   └── lib/
│   │       ├── auth.ts
│   │       └── translations/
│   │           ├── en.ts
│   │           └── index.ts
│   └── middleware.ts (for route protection)
├── backend/ (Node.js + Express)
│   ├── routes/
│   │   ├── auth.ts
│   │   └── user.ts
│   ├── middleware/auth.ts
│   └── utils/jwt.ts
├── .env
└── README.md
```

## Features

- Next.js 14 frontend with App Router and TypeScript
- Express backend API
- JWT authentication with HttpOnly cookies
- Protected routes
- i18n support
- Tailwind CSS styling

## Prerequisites

- Node.js 18+ and npm
- MySQL database

## Setup

1. Clone the repository
2. Configure database:
   - Create a database called `rental_db`
   - Create a `users` table with the following structure:
   ```sql
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     email VARCHAR(255) NOT NULL UNIQUE,
     password VARCHAR(255) NOT NULL,
     name VARCHAR(255),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```
   - Insert a test user:
   ```sql
   INSERT INTO users (email, password, name) VALUES 
   ('test@example.com', '$2a$10$5DgVG3Ct0c3BVn58/uw5HuALhnLBUkHn7t5MzFB7V9jvnQsdJg8zG', 'Test User');
   ```
   (Password is 'password123')

3. Install dependencies:
   - Frontend: `cd frontend && npm install`
   - Backend: `cd backend && npm install`

4. Configure environment variables:
   - Review the `.env` file and update as needed

5. Start the development servers:
   - Frontend: `cd frontend && npm run dev`
   - Backend: `cd backend && npm run dev`

6. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Development

- Frontend runs on port 3000
- Backend runs on port 3001
- Login with:
  - Email: test@example.com
  - Password: password123

## License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed. 