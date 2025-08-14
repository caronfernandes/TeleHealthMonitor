# Medical Workflow Application

## Overview

This is a full-stack medical consultation workflow application designed for Indian healthcare settings. The application guides doctors through a structured consultation process, from symptom selection through physical examination, investigations, and prescription management. It features a React frontend with TypeScript, an Express backend, and is designed to handle medical data with specific focus on Indian medical practices and multilingual support (Hindi/English).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern component-based UI built with React 18 and TypeScript for type safety
- **Routing**: Uses Wouter for client-side routing with path-based navigation
- **State Management**: React hooks for local state, TanStack Query for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Component Structure**: Modular workflow components (SymptomSelection, PhysicalExamination, InvestigationManagement, PrescriptionManagement)

### Backend Architecture
- **Express.js Server**: RESTful API server with TypeScript support
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **API Routes**: Resource-based endpoints for patients, consultations, medicines, and prescription templates
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes

### Data Storage Solutions
- **PostgreSQL Database**: Primary database using Drizzle ORM for type-safe database operations
- **Neon Database**: Cloud PostgreSQL provider for database hosting
- **Schema Design**: Relational schema with tables for users, patients, consultations, medicines, and prescription templates
- **JSON Storage**: Complex medical data (symptom details, examination findings, investigations) stored as JSONB for flexibility

### Authentication and Authorization
- **Session-based Authentication**: Uses connect-pg-simple for PostgreSQL-backed session storage
- **User Management**: Basic user authentication with username/password
- **Doctor-Patient Association**: Consultations linked to specific doctors and patients

### External Dependencies
- **Database**: Neon PostgreSQL for data persistence
- **UI Components**: Radix UI primitives for accessible, unstyled components
- **State Management**: TanStack Query for server state caching and synchronization
- **Styling**: Tailwind CSS with custom medical-themed color palette
- **Development Tools**: Vite for fast development builds and hot module replacement
- **Deployment**: Configured for Replit deployment with custom error overlays

### Key Design Patterns
- **Workflow State Machine**: Step-by-step consultation flow with state persistence
- **Component Composition**: Reusable UI components with prop-based configuration
- **Type Safety**: End-to-end TypeScript with shared schema definitions
- **Medical Data Modeling**: Structured approach to medical terminology and clinical decision support
- **Responsive Design**: Mobile-first design with adaptive layouts for various screen sizes

### Medical Domain Features
- **Symptom Classification**: Predefined symptom categories common in Indian medical practice
- **Red Flag Detection**: Automated clinical alerts based on examination findings
- **Investigation Recommendations**: Context-aware test suggestions based on symptoms
- **Prescription Templates**: Reusable medication combinations for common conditions
- **Multilingual Support**: Hindi and English labels for better accessibility