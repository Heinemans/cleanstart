# System Requirements

## Stack Versions
- **Node.js**: v18+ (LTS recommended)
- **Next.js**: 14.2.0
- **React**: 18.2.0
- **TailwindCSS**: 3.4.1
- **TypeScript**: 5.3.0
- **Lucide React**: 0.272.0
- **Database**: MySQL 8.0+

## Environment Setup

### Environment Variables
The application requires the following environment variables to be set in `.env.local`:

```
# Database Connection
DATABASE_URL=mysql://user:password@localhost:3306/cleanstart

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Additional environment variables may be configured as needed:
- `NODE_ENV`: Set to `development` during development, and `production` in production
- `PORT`: The port on which to run the application (defaults to 3000)

## Startup Flow
1. Ensure MySQL server is running and accessible via the configured DATABASE_URL
2. Install dependencies with `npm install`
3. Run database migrations if applicable
4. Start the development server with `npm run dev`
5. Access the application at `http://localhost:3000`

## Project Structure
```
/
├── app/                  # Next.js app router
│   ├── api/              # API routes
│   └── (routes)/         # Application routes
├── components/           # Reusable UI components
│   └── ui/               # Core UI components
├── frontend/
│   └── components/
│       └── formblocks/   # Specialized form block components
├── lib/                  # Utility functions and shared logic
├── database/             # Database models and migrations
├── docs/                 # Project documentation
│   ├── README.md         # Overview documentation
│   ├── requirements.md   # This file
│   ├── database.md       # Database documentation
│   └── changelog.md      # Version history
└── public/               # Static assets
```

## Form Blocks Structure
The application uses a modular form block architecture where each form section is encapsulated in a dedicated component:

- `RentalItemsBlock.tsx`: Manages rental items with validation
- Additional form blocks for boat times, customer information, etc.

Each form block handles its own:
- Data validation
- State management
- Error handling
- Parent component communication 