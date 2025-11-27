# React Local Environment Setup

This guide will help you set up the local development environment for the React frontend of the project.

## Prerequisites
- Node.js (v18 or above recommended)
- npm (comes with Node.js)

## Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react/
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173) by default.

## Project Structure
- `src/` - Main source code
- `public/` - Static assets
- `vite.config.ts` - Vite configuration
- `package.json` - Project dependencies and scripts

## Useful Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Troubleshooting
- If you encounter issues, ensure Node.js and npm are up to date.
- Delete `node_modules` and run `npm install` again if dependencies are corrupted.

## Additional Notes
- For API integration, update endpoints in `src/api/` and `src/config/routes.ts` as needed.
- Styling is managed with CSS files in `src/components/` and `src/pages/`.

---
For further help, contact the project maintainer.
