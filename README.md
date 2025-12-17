# Todo App

A full-stack Todo application built with Next.js 13 App Router, TypeScript, NextAuth.js, and Prisma. Users can register, sign in with email/password or Google OAuth, create, edit, delete, and filter their todos.

## Table of Contents
Features
Tech Stack
Getting Started
Environment Variables
Database Setup
Running Locally
Project Structure
Usage
License

## Features
User authentication via Email/Password and Google OAuth
Create, edit, delete todos
Filter todos by status (TODO, DONE)
Search todos by title/description
Sort todos by deadline
Responsive UI with Tailwind CSS
Session management with NextAuth.js
PostgreSQL database via Prisma ORM

## Tech Stack
Next.js 13 (App Router, React 18, TypeScript)
NextAuth.js for authentication
Prisma ORM for database access
PostgreSQL as the database
Tailwind CSS for styling
bcryptjs for password hashing

## Getting Started
These instructions will help you run the project locally.

### 1. Clone the repository
git clone https://github.com/<your-username>/todo-app.git
cd todo-app

### 2. Install dependencies
npm install
# or
yarn install

## Environment Variables
Create a .env file in the root folder (you can copy .env.example) and set the following variables:

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/todo_db_prisma"
NEXTAUTH_SECRET="super-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret


DATABASE_URL: PostgreSQL connection string
NEXTAUTH_SECRET: Secret key for NextAuth session
NEXTAUTH_URL: Local URL for NextAuth callbacks
GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET: For Google OAuth login

## Database Setup
This project uses Prisma and PostgreSQL.
Ensure PostgreSQL is installed and running.

### Create a database:
CREATE DATABASE todo_db_prisma;


### Generate Prisma client & apply migrations:
npx prisma migrate dev --name init
npx prisma generate

You can also inspect the database schema:
npx prisma studio

## Running Locally
Run the Next.js dev server:
npm run dev
# or
yarn dev
Open http://localhost:3000
 to view the app.

## Project Structure
src/
├─ app/
│  ├─ page.tsx            # Home page with todo list
│  ├─ signup/page.tsx     # Sign up page
│  ├─ layout.tsx          # Root layout with AuthProvider
│  └─ api/
│     ├─ auth/[...nextauth]/route.ts # NextAuth API routes
│     └─ todos/           # Todos CRUD API routes
├─ components/
│  ├─ AuthProvider.tsx    # Wraps SessionProvider
│  ├─ TodoForm.tsx        # Todo creation form
│  ├─ TodoItem.tsx        # Single todo item component
│  ├─ TodoList.tsx        # List of todos
│  └─ TodoFilter.tsx      # Search/filter UI
├─ hooks/
│  └─ useTodos.ts         # Custom hook for todos logic
├─ lib/
│  ├─ prisma.ts           # Prisma client
│  └─ auth.ts             # Server session helper
└─ types/
   └─ next-auth.d.ts      # Custom NextAuth typings

## Usage
Visit Sign Up page (/signup) to create a new account.
Sign in using email/password or Google OAuth.
Create todos with a title, optional description, and optional deadline.
Use search bar and status filter to find specific todos.
Edit or delete todos directly from the list.
Sign out to return to the login screen.

## Notes
Passwords are securely hashed using bcryptjs.
Todos are user-specific, secured by server-side session checks.
Prisma ensures database-level ownership checks on each todo.

## License
This project is licensed under the MIT License.