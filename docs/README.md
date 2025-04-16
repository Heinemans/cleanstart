# CleanStart Rental Management System

## Project Description
CleanStart is a comprehensive rental management system designed to streamline the process of managing boat rentals and related services. The application allows administrators to track rentals, manage inventory, schedule boat times, and maintain customer relationships.

## Tech Stack
- **Frontend**: Next.js 14.2.0, React 18.2.0, TailwindCSS 3.4.1
- **Backend**: Next.js API Routes (with potential for Express.js integration)
- **Database**: MySQL (accessible via the configured DATABASE_URL)
- **UI Components**: Custom components built with shadcn/ui principles
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL database

### Installation
1. Clone the repository
2. Copy `.env.example` to `.env.local` and update the variables:
   ```
   DATABASE_URL=mysql://user:password@localhost:3306/cleanstart
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Documentation
- [System Requirements](./requirements.md) - Detailed technical requirements and project structure
- [Database Schema](./database.md) - Database tables structure and relationships
- [Changelog](./changelog.md) - Version history and feature additions

## Project Structure
- `/app` - Next.js app router pages and layouts
- `/components` - Reusable UI components
- `/frontend/components` - Form blocks and specialized components
- `/lib` - Utility functions and shared logic
- `/database` - Database schemas and migrations 