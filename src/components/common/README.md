
# SupportDesk – Customer Support Dashboard

## Project Overview

SupportDesk is a customer support ticket management application built using React and TypeScript.

It helps administrators, managers, and agents manage customer support tickets, track ticket status, and assign tickets to agents.

## Technologies Used

- React.js
- TypeScript
- Redux Toolkit
- RTK Query
- React Router DOM
- HTML5 and CSS3
- Vite
- Vitest
- React Testing Library
- JSON Server

## Features

### Authentication and Authorization
- Login and logout functionality.
- Role-based access control.
- Protected routes.
- Session management.
- Unauthorized session handling.

### Ticket Management
- Create, update, and delete tickets.
- Assign tickets to agents.
- Update ticket status.
- Bulk ticket operations.

### Search and Filtering
- Search tickets with debounce.
- Filter by status and priority.
- Sort ticket records.
- Pagination.

### API Handling
- Centralized API error handling.
- Loading and error states.
- Request timeout.
- Automatic retry for network and server errors.
- RTK Query request lifecycle management.

## Project Structure

src/
- app/ – Redux store and API configuration
- components/ – Reusable UI components
- context/ – Authentication context
- features/ – Redux Toolkit API and slices
- hooks/ – Custom React hooks
- pages/ – Application pages
- routes/ – Protected routes
- services/ – Authentication services
- styles/ – Global styles
- types/ – TypeScript interfaces

## Installation

Clone the repository:

    git clone YOUR_REPOSITORY_URL

Navigate to the project:

    cd task_management

Install dependencies:

    npm install

## Environment Configuration

Create a `.env` file in the project root:

    VITE_API_URL=http://localhost:5000

Use your actual API URL when connecting to the deployed backend.

## Run the Application

Start the frontend:

    npm run dev

Start JSON Server in another terminal:

    npm run server

Frontend:

    http://localhost:5173

Backend:

    http://localhost:5000

## Testing

Run tests:

    npm run test:run

Run production build:

    npm run build

## API Error Handling

The application uses a centralized RTK Query base query to handle common API errors, request timeouts, and retry behavior.

Network errors, timeout errors, and server errors are eligible for retry.

## Authentication Note

The current project uses mock authentication with predefined users and sessionStorage. It does not currently implement real JWT authentication.

## Testing Summary

Component tests cover:
- Loading state
- Empty state
- Table row rendering
- Sorting
- Pagination
- Row selection

## Future Improvements

- Integrate a production authentication API.
- Implement backend-side pagination and filtering.
- Add more integration and API tests.
- Improve automated deployment workflows.
