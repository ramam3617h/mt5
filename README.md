# CRM Pro - Multi-Tenant Customer Relationship Management System

A full-stack CRM application built with React, Express.js, Node.js, and PostgreSQL (via Supabase) featuring multi-tenant architecture and role-based access control.

## Features

- **Multi-Tenant Architecture**: Complete tenant isolation at the database level
- **Role-Based Access Control**: Four user roles (Admin, Manager, Sales, Support) with different permissions
- **Dashboard**: Real-time analytics and metrics
- **Customer Management**: Add, edit, and track customer relationships
- **User Management**: Invite team members and assign roles (Admin only)
- **Activity Tracking**: Log interactions with customers
- **Secure Authentication**: Email/password authentication with JWT tokens

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Vite for build tooling

### Backend
- Express.js with TypeScript
- Node.js
- Supabase (PostgreSQL) for database
- Row Level Security (RLS) for data isolation

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up database:
Ask me to add database persistence and I'll help you set up the required schema.

3. Start the development servers:

Frontend:
```bash
npm run dev
```

Backend (in a separate terminal):
```bash
npm run dev:server
```

The frontend will run on `http://localhost:5173` and the backend on `http://localhost:3001`.

## User Roles & Permissions

### Admin
- Full access to all features
- Can invite and manage users
- Can manage all customers
- Can view all analytics

### Manager
- Can manage all customers
- Can view all activities
- Can view analytics
- Cannot manage user roles

### Sales
- Can create and edit customers
- Can only view assigned customers
- Can log activities for their customers

### Support
- Can view assigned customers
- Can log activities for their customers
- Read-only access to customer data

## Project Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts (Auth)
│   ├── lib/           # API client
│   ├── pages/         # Page components
│   └── App.tsx        # Main app component
├── server/
│   ├── middleware/    # Auth & tenant middleware
│   ├── routes/        # API routes
│   └── index.ts       # Express server
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account and tenant
- `POST /api/auth/login` - Login to existing account
- `POST /api/auth/logout` - Logout current user

### Customers
- `GET /api/customers` - List all customers (filtered by role)
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer (Admin/Manager only)

### Users
- `GET /api/users` - List all users in tenant
- `POST /api/users/invite` - Invite new user (Admin only)
- `PUT /api/users/:id/role` - Update user role (Admin only)
- `DELETE /api/users/:id` - Remove user (Admin only)

### Activities
- `GET /api/activities` - List activities
- `POST /api/activities` - Create new activity

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard metrics

## Security Features

- Multi-tenant data isolation via Row Level Security
- JWT-based authentication
- Role-based access control
- Secure password handling
- SQL injection prevention
- CORS protection

## Build

```bash
npm run build
```

## License

MIT
