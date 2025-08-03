const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Database = require('./database');
const scrapeOpportunities = require('./scraper');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
const db = new Database();

// Routes
app.get('/api/opportunities', async (req, res) => {
  try {
    const opportunities = await db.getUnswipedOpportunities(req.query.userId || 'default');
    res.json(opportunities);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    res.status(500).json({ error: 'Failed to fetch opportunities' });
  }
});

app.post('/api/swipe', async (req, res) => {
  try {
    const { userId = 'default', opportunityId, direction } = req.body;
    await db.recordSwipe(userId, opportunityId, direction);
    res.json({ success: true });
  } catch (error) {
    console.error('Error recording swipe:', error);
    res.status(500).json({ error: 'Failed to record swipe' });
  }
});

app.post('/api/scrape', async (req, res) => {
  try {
    console.log('Starting scrape for new opportunities...');
    const opportunities = await scrapeOpportunities(genAI);
    
    for (const opportunity of opportunities) {
      await db.addOpportunity(opportunity);
    }
    
    res.json({ 
      success: true, 
      count: opportunities.length,
      message: `Successfully scraped ${opportunities.length} new opportunities` 
    });
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'Failed to scrape opportunities' });
  }
});

app.get('/api/liked', async (req, res) => {
  try {
    const liked = await db.getLikedOpportunities(req.query.userId || 'default');
    res.json(liked);
  } catch (error) {
    console.error('Error fetching liked opportunities:', error);
    res.status(500).json({ error: 'Failed to fetch liked opportunities' });
  }
});

app.delete('/api/liked/:opportunityId', async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const userId = req.query.userId || 'default';
    
    const removed = await db.removeSwipe(userId, opportunityId);
    
    if (removed) {
      res.json({ success: true, message: 'Opportunity removed from liked list' });
    } else {
      res.status(404).json({ error: 'Liked opportunity not found' });
    }
  } catch (error) {
    console.error('Error removing liked opportunity:', error);
    res.status(500).json({ error: 'Failed to remove liked opportunity' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Swipe4Care server running on port ${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`  GET  /api/opportunities - Get unswiped opportunities`);
  console.log(`  POST /api/swipe - Record a swipe`);
  console.log(`  POST /api/scrape - Trigger scraping`);
  console.log(`  GET  /api/liked - Get liked opportunities`);
  console.log(`  DELETE /api/liked/:id - Remove liked opportunity`);
});