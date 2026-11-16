# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
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