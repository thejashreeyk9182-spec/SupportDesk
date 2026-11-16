# SupportDesk - Customer Support Dashboard

A responsive customer support ticket management application built using React and TypeScript.

## Features
- Role-based access: Admin, Manager, Agent
- Login and protected routes
- Create, update and delete tickets
- Assign tickets to agents
- Bulk status updates and assignment
- Search, filtering, sorting and pagination
- Dashboard ticket statistics
- Loading, error and empty states
- Centralized API error handling
- API timeout and retry handling
- Reusable components and custom hooks

## Technologies
- React.js
- TypeScript
- Vite
- Redux Toolkit
- RTK Query
- React Router
- CSS
- JSON Server
- Vitest
- React Testing Library

## Installation

Clone the repository:

    git clone https://github.com/thejashreeyk9182-spec/SupportDesk.git

Install dependencies:

    npm install

Create `.env.development`:

    VITE_API_URL=http://localhost:5000

Start backend:

    npm run server

Start frontend in another terminal:

    npm run dev

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@gmail.com | Admin@123 |
| Manager | manager@gmail.com | Manager@123 |
| Agent | agent@gmail.com | Agent@123 |

Note: Authentication currently uses mock users and session storage.

## Run Tests

    npm run test:run

## Production Build

    npm run build

## Live Demo

https://supportdes-dashboard.netlify.app

## GitHub

https://github.com/thejashreeyk9182-spec/SupportDesk
