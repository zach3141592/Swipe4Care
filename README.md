# Swipe4Care

A modern app to discover healthcare and clinical trial volunteer opportunities with an intuitive swipe interface. Built with React, Node.js, and powered by Google's Gemini AI for intelligent opportunity discovery.

Demo: https://www.youtube.com/watch?v=2RFJAIPhFiw&t=1s

## Tech Stack

**Frontend:**

- React 18 with TypeScript
- Framer Motion (animations)
- Styled Components (styling)
- Axios (HTTP client)

**Backend:**

- Node.js with Express
- SQLite (database)
- Google Gemini AI API
- CORS enabled

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- The app comes pre-configured with a Gemini API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd Swipe4Care
   ```

2. **Install dependencies**

   ```bash
   npm run install-all
   ```

3. **Start the development servers** (API key already configured!)

   ```bash
   npm run dev
   ```

   This starts both the backend (port 3001) and frontend (port 3000) servers.

4. **Open your browser**
   Navigate to `http://localhost:3000` to use the app!

   > ✅ **All issues fixed!** The app is fully functional with Gemini 1.5 Flash API and clean TypeScript compilation.

## How It Works

1. **Opportunity Discovery**: The app uses Gemini AI to generate and discover realistic healthcare and clinical trial opportunities
2. **Swipe Interface**: Users can swipe right to save opportunities they're interested in, or swipe left to pass
3. **Persistent Storage**: All interactions are saved to a local SQLite database
4. **View Saved**: Users can view all their liked opportunities with direct links to apply

## API Endpoints

- `GET /api/opportunities` - Get unswiped opportunities for a user
- `POST /api/swipe` - Record a swipe interaction
- `POST /api/scrape` - Trigger discovery of new opportunities
- `GET /api/liked` - Get all liked opportunities for a user

## Project Structure

```
Swipe4Care/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx         # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Express server
│   ├── database.js        # SQLite database
│   └── scraper.js         # Gemini AI integration
├── package.json           # Root package.json
└── README.md
```

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend
- `npm run install-all` - Install dependencies for both frontend and backend
- `npm run build` - Build the frontend for production

## Customization

### Adding New Opportunity Sources

Edit `server/scraper.js` to modify the Gemini AI prompts or add additional data sources.

### Styling

The app uses a black and white theme defined in styled-components. Key styling files:

- `client/src/App.tsx` (GlobalStyle)
- `client/src/components/*.tsx` (Component styles)

### Database Schema

The SQLite database has two main tables:

- `opportunities` - Store opportunity details
- `swipes` - Track user interactions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Security & Environment

If you want to use your own API key, simply edit the `.env` file.

## Support

If you encounter any issues or have questions:

1. Check the console logs for error messages
2. Ensure your Gemini API key is correctly set
3. Verify all dependencies are installed
4. Create an issue on GitHub with details

---
