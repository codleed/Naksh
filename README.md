# Naksh Client

A modern React + TypeScript client application with authentication features, built with Tailwind CSS and TanStack Query.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query (React Query)** - Server state management
- **Axios** - HTTP client with interceptors
- **React Router** - Client-side routing
- **Vite** - Fast build tool and development server

## Project Structure

```
client/
├── public/
│   └── index.html
├── src/
│   ├── assets/                 # Static assets (images, icons, etc.)
│   ├── components/             # Reusable (global) components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   └── index.ts
│   │   └── index.ts           # Export all global components
│   ├── pages/                 # All route-level pages
│   │   ├── Home/
│   │   │   ├── Home.tsx
│   │   │   └── index.ts
│   │   ├── Login/
│   │   │   ├── Login.tsx
│   │   │   └── index.ts
│   │   ├── Register/
│   │   │   ├── Register.tsx
│   │   │   └── index.ts
│   │   └── index.ts           # Central export for all pages
│   ├── layout/                # App-wide layout components
│   │   ├── Navbar.tsx
│   │   └── index.ts
│   ├── providers/             # React providers
│   │   └── QueryProvider.tsx
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useForm.ts
│   │   └── useApi.ts
│   ├── utils/                 # Utility functions
│   │   ├── api.ts
│   │   ├── validation.ts
│   │   └── cn.ts
│   ├── App.tsx                # Root component
│   └── main.tsx               # App entry point
├── package.json
└── README.md
```

## Features

### Authentication
- **Login Page**: User authentication with email and password
- **Registration Page**: New user registration with form validation
- **React Query Integration**: Optimized server state management with caching
- **Axios HTTP Client**: Robust API communication with interceptors
- **Protected Routes**: Route protection based on authentication status

### Components
- **Button**: Reusable button component with multiple variants and sizes
- **Input**: Form input component with validation and error handling
- **Navbar**: Navigation component with responsive design and auth state

### State Management
- **TanStack Query (React Query)**: Server state management with caching, background updates, and optimistic updates
- **Axios**: HTTP client with request/response interceptors and error handling
- **Custom Hooks**: Reusable data fetching and form handling logic

### Utilities
- **API Client**: Centralized API communication with authentication
- **Form Validation**: Comprehensive form validation utilities
- **Query Hooks**: Reusable React Query hooks for CRUD operations

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
NODE_ENV=development
```

## API Integration

The application uses **Axios** for HTTP requests and **TanStack Query** for server state management.

### Key Features:
- **Automatic token management** via Axios interceptors
- **Request/Response interceptors** for error handling
- **Query caching and background updates** with React Query
- **Optimistic updates** for better UX
- **Automatic retry logic** for failed requests

### Expected API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh authentication token
- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/profile` - Update user profile

### React Query Features Used:
- **Query caching** with 5-minute stale time
- **Background refetching** on window focus
- **Automatic retries** for failed requests
- **Optimistic updates** for mutations
- **DevTools integration** for debugging

## Styling

The application uses **Tailwind CSS** for styling:
- **Utility-first CSS framework** for rapid development
- **Responsive design** with mobile-first approach
- **Consistent design system** with predefined colors and spacing
- **Custom components** built with Tailwind utilities
- **Dark mode support** (can be easily added)
- **Optimized bundle size** with purging unused styles

## Form Validation

Built-in validation for:
- Email format validation
- Password strength requirements
- Required field validation
- Password confirmation matching

## State Management

- **TanStack Query**: For server state management and caching
- **React Query DevTools**: For debugging and monitoring queries
- **Custom Hooks**: For form state management and API operations
- **Local State**: For component-specific UI state

### Available Hooks:

#### Authentication Hooks (`src/hooks/useAuth.js`)
- `useCurrentUser()` - Get current authenticated user
- `useLogin()` - Login mutation with automatic token management
- `useRegister()` - Registration mutation
- `useLogout()` - Logout mutation with cache clearing
- `useAuthState()` - Combined auth state hook

#### Generic API Hooks (`src/hooks/useApi.js`)
- `useResource(endpoint)` - CRUD operations for any resource
- `useSearch(endpoint, term)` - Search functionality
- `useOptimisticUpdate(endpoint)` - Optimistic updates

#### Form Hooks (`src/hooks/useForm.js`)
- `useForm(initialValues, schema)` - Form state and validation

## Contributing

1. Follow the established folder structure
2. Keep components focused and reusable
3. Add proper error handling
4. Include CSS files for styling
5. Export components through index.js files

## Architecture Principles

- **Component Isolation**: Each component is self-contained with its own styles
- **Separation of Concerns**: Clear separation between UI, logic, and data
- **Reusability**: Components designed for reuse across the application
- **Maintainability**: Clear folder structure and naming conventions