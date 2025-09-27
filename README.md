# 🏢 Verto Employee Management System

A modern, full-stack employee management application built with React, TypeScript, and Supabase. This system provides comprehensive CRUD operations for managing employee data with a beautiful, responsive UI and robust authentication.

## 📋 Project Overview

The Verto Employee Management System is a professional-grade web application designed to streamline employee data management. It features a clean, modern interface with real-time data synchronization, secure authentication, and comprehensive testing coverage.

### ✨ Key Features

- **🔐 Secure Authentication** - Google & GitHub OAuth integration via Supabase
- **👥 Employee Management** - Complete CRUD operations (Create, Read, Update, Delete)
- **🔍 Advanced Search** - Real-time filtering by name, ID, email, or position
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **🎨 Modern UI** - Built with shadcn/ui components and Tailwind CSS
- **⚡ Real-time Updates** - Instant data synchronization across sessions
- **🧪 Comprehensive Testing** - Full test coverage for components and business logic
- **🚀 Type Safety** - Built with TypeScript for enhanced developer experience

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **React Query** - Server state management and caching
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Row Level Security (RLS)** - Database-level security policies
- **Real-time subscriptions** - Live data updates

### Testing
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities
- **MSW (Mock Service Worker)** - API mocking for tests
- **User Event** - Realistic user interaction testing

## 🚀 Getting Started

### Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- A **Supabase account** (free tier available)

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd cogwork-crew
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 🔐 Authentication Setup

### Google Authentication

1. **Create Google OAuth App**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `https://your-project-ref.supabase.co/auth/v1/callback`

2. **Configure in Supabase**
   - Go to Authentication > Providers in your Supabase dashboard
   - Enable Google provider
   - Add your Google Client ID and Client Secret

### GitHub Authentication

1. **Create GitHub OAuth App**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth App
   - Set Authorization callback URL to:
     - `https://your-project-ref.supabase.co/auth/v1/callback`

2. **Configure in Supabase**
   - Go to Authentication > Providers in your Supabase dashboard
   - Enable GitHub provider
   - Add your GitHub Client ID and Client Secret

### Email Authentication (Optional)

Email/password authentication is also supported out of the box with Supabase's built-in email service.

## 🧪 Running Tests

This project includes comprehensive test coverage for all major functionality.

### Test Structure

```
src/test/
├── components/          # Component integration tests
├── hooks/              # Custom hook tests
├── business/           # Business logic validation tests
├── auth/               # Authentication flow tests
├── mocks/              # Mock data and server setup
└── utils/              # Test utilities and helpers
```

### Running Tests

**Run all tests:**
```bash
npm test
```

**Run tests in watch mode:**
```bash
npm test -- --watch
```

**Run tests with UI (interactive):**
```bash
npm run test:ui
```

**Run tests with coverage report:**
```bash
npm run test:coverage
```

**Run specific test files:**
```bash
# Component tests
npm test -- src/test/components/EmployeeTable.test.tsx

# Hook tests
npm test -- src/test/hooks/useEmployees.test.ts

# Business logic tests
npm test -- src/test/business/employee-validation.test.ts

# Authentication tests
npm test -- src/test/auth/AuthProvider.test.tsx
```

### Test Coverage

The test suite covers:

- ✅ **CRUD Operations** - Create, read, update, delete employees
- ✅ **Data Validation** - Input validation and business rules
- ✅ **User Interface** - Component rendering and interactions
- ✅ **Authentication** - Login/logout flows and route protection
- ✅ **Error Handling** - Network errors and edge cases
- ✅ **Search Functionality** - Real-time filtering and search
- ✅ **Responsive Design** - Mobile and desktop layouts

## 🏗️ Architecture & Design Choices

### Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── auth/          # Authentication components
│   ├── employees/     # Employee management components
│   └── ui/            # Base UI components (shadcn/ui)
├── hooks/             # Custom React hooks
├── integrations/      # External service integrations
├── pages/             # Page components
├── test/              # Test files and utilities
└── types/             # TypeScript type definitions
```

### Key Design Decisions

#### 1. **Component Architecture**
- **Separation of Concerns**: UI components are separate from business logic
- **Reusable Components**: Built with shadcn/ui for consistency
- **Custom Hooks**: Business logic abstracted into reusable hooks
- **Type Safety**: Full TypeScript coverage for better developer experience

#### 2. **State Management**
- **React Query**: Server state management with caching and synchronization
- **Local State**: React hooks for UI state management
- **No Global State**: Avoided Redux/Zustand for simplicity

#### 3. **Authentication Strategy**
- **Supabase Auth**: Leveraged Supabase's built-in authentication
- **OAuth Integration**: Google and GitHub for social login
- **Route Protection**: AuthProvider wrapper for secure routes
- **Automatic Redirects**: Smart routing based on authentication status

#### 4. **Database Design**
- **PostgreSQL**: Robust relational database via Supabase
- **Row Level Security**: Database-level security policies
- **UUID Primary Keys**: Better security and scalability
- **Timestamps**: Automatic created_at and updated_at tracking

#### 5. **UI/UX Decisions**
- **Mobile-First**: Responsive design starting from mobile
- **Accessibility**: ARIA labels and keyboard navigation
- **Loading States**: Clear feedback for async operations
- **Error Handling**: User-friendly error messages
- **Search & Filter**: Real-time search without backend calls

#### 6. **Testing Strategy**
- **Unit Tests**: Individual component and hook testing
- **Integration Tests**: Full user flow testing
- **Mocking**: Supabase client mocking for reliable tests
- **Coverage**: Comprehensive test coverage for critical paths

### Assumptions Made

1. **User Authentication**: All users must be authenticated to access the system
2. **Employee Data**: Basic employee information is sufficient (name, ID, email, position)
3. **Single Tenant**: All authenticated users can see all employees
4. **Real-time Updates**: Users expect immediate data synchronization
5. **Modern Browsers**: Targeting ES2020+ browser support
6. **Internet Connection**: Application requires internet connectivity

## 📱 Features Walkthrough

### 🔐 Authentication Flow
1. Users land on the login page (`/auth`)
2. Choose between Google, GitHub, or email authentication
3. Successful login redirects to employee management (`/employees`)
4. Sign out returns to login page

### 👥 Employee Management
1. **View Employees**: See all employees in a responsive table
2. **Add Employee**: Click "Add Employee" to open creation form
3. **Edit Employee**: Click edit icon to modify employee details
4. **Delete Employee**: Click delete icon with confirmation dialog
5. **Search**: Real-time filtering by any employee field

### 🔍 Search & Filter
- **Real-time Search**: Filter as you type
- **Multi-field Search**: Search by name, ID, email, or position
- **Clear Search**: Easy search reset functionality

## 🎥 Video Demo

> **📹 Demo Video**: [Add your video link here]
> 
> The demo video showcases:
> - Authentication flow (Google/GitHub login)
> - Employee CRUD operations
> - Search and filtering functionality
> - Responsive design on different screen sizes
> - Error handling and validation

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify/Vercel

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Environment Variables**: Add your Supabase credentials

### Environment Variables for Production

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** - For the excellent backend-as-a-service platform
- **shadcn/ui** - For the beautiful, accessible UI components
- **Tailwind CSS** - For the utility-first CSS framework
- **React Query** - For excellent server state management
- **Vitest** - For the fast and reliable testing framework

---

**Built with ❤️ by [Your Name]**

For questions or support, please open an issue or contact [your-email@example.com]
