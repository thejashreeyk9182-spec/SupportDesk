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


## Application Monitoring

The application includes a basic client-side monitoring system.

### Structured Logging
- Supports info, warning, error and debug log levels.
- Includes timestamps and contextual information.
- Redacts common sensitive context fields.

### API Monitoring
- Tracks API endpoints, HTTP methods and response status.
- Records request duration and success or failure.
- Retries eligible failed GET requests.
- Maintains the latest 100 API metrics.

### Performance Monitoring
- Measures custom application operations.
- Observes browser performance entries for FCP, LCP, CLS and event durations.
- Tracks an approximate INP session measurement.
- Records navigation TTFB.

### Error Handling
- React Error Boundary for rendering errors.
- Global JavaScript error handling.
- Unhandled promise rejection handling.
- Centralized error reporting.

### Monitoring Dashboard
- Displays API request statistics.
- Shows recent API activity.
- Displays performance measurements.
- Lists recent application errors.

Note: Monitoring data is maintained in memory and resets when the application is refreshed. Error reporting is currently local; no external monitoring service is connected.
