# Next Prisma Todo App

A modern Todo application built with **Next.js 13**, **Prisma**, **NextAuth.js**, and **PostgreSQL**.  
Supports email/password authentication, Google OAuth, and CRUD operations for Todos with filtering and sorting.

---

## Table of Contents

- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Environment Variables](#environment-variables)
  - [Database Migration](#database-migration)
  - [Run Locally](#run-locally)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Demo

You can run this project locally and see a fully working Todo application with authentication.

---

## Tech Stack

- **Next.js 13** – React framework for server/client rendering
- **TypeScript** – Type safety
- **Prisma** – ORM for PostgreSQL
- **NextAuth.js** – Authentication (Email & Google OAuth)
- **PostgreSQL** – Database
- **Tailwind CSS** – Styling

---

## Features

- Sign up / Sign in with email/password or Google OAuth
- Create, edit, delete todos
- Toggle todo status (TODO / DONE)
- Search, filter, and sort todos
- Secure routes using NextAuth.js sessions
- Prisma ORM for database operations

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- PostgreSQL database

### Setup

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/next-prisma-todo-app.git
cd next-prisma-todo-app

Install dependencies:

```bash
npm install
# or
yarn install

### Environment Variables

Create a .env file based on .env.example:

```bash
cp .env.example .env

Fill in the following variables:

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

Check your database:

```bash
npx prisma studio

### Run Locally

Start the development server:

```bash
npm run dev
# or
yarn dev
Open http://localhost:3000
 to view the app.

Project Structure
next-prisma-todo-app/
├─ prisma/                  # Prisma schema & migrations
├─ src/
│  ├─ app/                  # Next.js app routes
│  │  ├─ api/               # API routes
│  │  │  ├─ auth/           # NextAuth.js authentication
│  │  │  └─ todos/          # Todo CRUD API
│  │  ├─ page.tsx           # Home page
│  │  └─ signup/page.tsx    # Signup page
│  ├─ components/           # React components
│  ├─ hooks/                # Custom hooks
│  └─ lib/                  # Helper libraries (prisma, auth)
├─ .env                     # Environment variables
├─ package.json
└─ tsconfig.json

### Authentication

Email/password authentication using NextAuth.js with Prisma adapter

Google OAuth sign-in

Protected routes based on session

### Usage

Sign up using email/password or Google

Create new todos using the form

Edit, delete, or toggle status of todos

Filter, search, and sort todos with the filter panel

### License

This project is licensed under the MIT License.
