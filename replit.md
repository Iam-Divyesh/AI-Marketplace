# ArtisanAI - AI-Powered Artisan Marketplace

## Overview

ArtisanAI is a modern marketplace platform that connects local artisans with art lovers worldwide. It's built as a full-stack web application featuring a React frontend with a dark-themed UI enhanced by neon accents (purple and teal), 3D animations, and an Express.js backend. The platform integrates AI-powered product recommendations using OpenAI's GPT-5 to help users discover handcrafted items through natural language queries.

The application serves as a comprehensive marketplace where artisans can showcase and sell their handmade products, while buyers can browse, search, and get personalized recommendations through an AI chat assistant. The platform emphasizes visual appeal with glassmorphism effects, smooth animations, and responsive design optimized for all devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client uses React 18 with TypeScript as the primary framework, following a component-based architecture. The UI layer leverages Tailwind CSS for styling with a custom dark theme featuring CSS variables for consistent theming. Motion is handled through Framer Motion for smooth animations and transitions. The component library is built on Shadcn/ui components with Radix UI primitives underneath.

Routing is managed by Wouter, a lightweight alternative to React Router. State management follows React's built-in patterns with hooks, while server state is handled by TanStack Query (React Query) for efficient data fetching, caching, and synchronization.

The build system uses Vite for fast development with hot module replacement and efficient production builds. The frontend includes a custom 3D illustration component using CSS animations instead of Three.js libraries for simplicity.

### Backend Architecture  
The server runs on Node.js with Express.js providing the HTTP API layer. The architecture follows RESTful principles with clearly defined routes for products, AI recommendations, and chat functionality. TypeScript is used throughout for type safety and better developer experience.

The API structure includes:
- `/api/products` - Product CRUD operations with filtering capabilities
- `/api/ai` - AI-powered product recommendations and chat responses  
- Error handling middleware for consistent error responses
- CORS and request parsing middleware

The server integrates with OpenAI's API for natural language processing, allowing users to query products conversationally. The AI service parses user queries and returns relevant product recommendations with explanations.

### Data Storage Solutions
The application currently uses an in-memory storage system with sample data for development and demonstration. The storage layer is abstracted through an interface pattern, making it easy to swap implementations.

Drizzle ORM is configured for PostgreSQL with schema definitions for users, products, and chat sessions. The schema includes proper relationships between entities and uses UUIDs for primary keys. Migration support is built-in through Drizzle Kit.

The data models support:
- User management with artisan profiles
- Product catalog with categories, pricing, and metadata
- Chat session tracking for AI interactions
- Filtering and search capabilities across products

### Authentication and Authorization
Currently, the application includes basic user model structures but authentication is not fully implemented. The backend includes user creation endpoints and session management preparation. The schema supports username/password authentication with email verification capabilities.

## External Dependencies

### Database Services
- **PostgreSQL**: Configured through Drizzle ORM for production data persistence
- **Neon Database**: Serverless PostgreSQL provider configured through connection strings
- **Connect-PG-Simple**: Session store adapter for PostgreSQL sessions

### AI and API Services  
- **OpenAI API**: Powers the AI recommendation engine and chat assistant using GPT-5 model
- **Natural Language Processing**: Handles user queries for product discovery and shopping assistance

### Frontend Libraries
- **React Ecosystem**: React 18, React DOM, React Hook Form for form management
- **UI Components**: Radix UI primitives for accessible component foundations
- **Styling**: Tailwind CSS with custom theme variables and responsive design utilities
- **Animation**: Framer Motion for smooth transitions and micro-interactions
- **State Management**: TanStack Query for server state, React's built-in state for local state

### Development and Build Tools
- **Vite**: Modern build tool for fast development and optimized production builds
- **TypeScript**: Type safety across the entire application stack
- **ESBuild**: Fast bundler for production server builds
- **PostCSS**: CSS processing with Tailwind CSS integration
- **Hot Module Replacement**: Real-time code updates during development

### Utility Libraries
- **Date-fns**: Date manipulation and formatting
- **Class Variance Authority**: Utility for creating component variants
- **clsx**: Conditional className utility
- **Zod**: Runtime type validation and schema parsing
- **Nanoid**: Unique ID generation for entities

The application is designed to be deployment-ready with environment variable configuration for database connections and API keys. The modular architecture supports easy scaling and feature additions.