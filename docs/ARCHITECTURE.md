
# SupportDesk – Application Architecture

## 1. Project Overview

SupportDesk is a customer support ticket management application built using React and TypeScript.

It helps support teams create, manage, assign, track, and resolve customer support tickets.

The application supports three roles:
- Admin
- Manager
- Agent

## 2. Technology Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Type safety |
| Redux Toolkit | Global state management |
| RTK Query | API communication and caching |
| React Router | Application routing |
| CSS | Styling |
| JSON Server | Mock REST API |
| Vitest | Unit testing |
| React Testing Library | Component testing |
| Vite | Development and production build |

## 3. Application Architecture

The application follows a component-based architecture.

Main layers:

1. Pages – Application screens.
2. Components – Reusable UI components.
3. Hooks – Reusable business logic.
4. Features – Redux state and API logic.
5. Routes – Navigation and route protection.
6. Monitoring – Error and performance monitoring.
7. Types – Shared TypeScript definitions.

## 4. Folder Structure

```text
src/
├── components/
│   ├── common/
│   │   ├── forms/
│   │   ├── Modal/
│   │   └── DataTable.tsx
│   ├── Header/
│   ├── TicketForm/
│   └── TicketTable/
├── features/
│   ├── auth/
│   └── tickets/
├── hooks/
├── monitoring/
├── pages/
│   ├── Admin/
│   ├── Dashboard/
│   ├── Login/
│   └── Unauthorized/
├── routes/
├── types/
├── App.tsx
└── main.tsx
```

## 5. State Management

Redux Toolkit manages shared application state.

RTK Query handles:
- API requests
- Server data caching
- Loading states
- Error states
- Data updates and invalidation

Custom React hooks handle reusable local UI logic.

## 6. Role-Based Access Control

The application supports:

- Admin: Administrative access.
- Manager: Ticket management and assignment according to permissions.
- Agent: Assigned ticket management according to permissions.

Protected routes prevent unauthorized users from accessing restricted pages.

Permission checks control access to individual actions.

## 7. Reusable Components

The application uses reusable components to reduce duplication.

Examples:
- DataTable
- Modal
- InputField
- SelectField
- TextAreaField
- CheckboxField
- SubmitButton
- FormError

The generic DataTable supports reusable columns, custom cell rendering, sorting, pagination, loading and empty states.

## 8. Custom Hooks

Reusable hooks include:

- useDebounce – Delays search updates.
- useToggle – Manages boolean state.
- usePagination – Handles pagination logic.
- useOutsideClick – Detects clicks outside an element.
- useDashboardTickets – Manages dashboard selection and bulk status updates.

## 9. Error Handling and Monitoring

The application includes:
- Error boundaries
- API error handling
- Loading and error states
- Centralized logging
- Global error handling
- Performance measurements

Monitoring data is currently maintained locally in memory.

## 10. Testing Strategy

Vitest and React Testing Library are used to test application functionality.

Tests cover:
- Reusable components
- Form components
- Modal behavior
- Custom hooks
- Monitoring utilities
- Ticket management functionality

## 11. Performance Optimization

Performance improvements include:
- Lazy loading of route components
- React Suspense
- Reusable components
- Debounced search
- Pagination
- Efficient Redux state management

## 12. Build and Validation

The following commands are used for validation:

```bash
npx tsc --noEmit
npx vitest run
npm run build
```

All three checks passed during the current Day 17 validation.

## 13. Future Improvements

- Add integration with a production monitoring service.
- Add more custom hook tests.
- Improve automated end-to-end testing.
- Connect a production backend.
- Add deployment and CI/CD workflows.
