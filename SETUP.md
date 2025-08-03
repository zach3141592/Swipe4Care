# 🚀 Quick Setup Guide for Swipe4Care

## 1. Get Your Gemini API Key (if needed)

The app is already configured with a working API key! But if you want to use your own:

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key for the next step

## 2. Set Up Environment (optional)

If you want to use your own API key, edit the `.env` file:

```bash
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
```

## 3. Start the App

Run the startup script:

```bash
./start.sh
```

Or manually:

```bash
npm run dev
```

## 4. Open Your Browser

Navigate to: http://localhost:3000

## That's it! 🎉

The app will:

- Automatically generate healthcare opportunities using AI
- Allow you to swipe through them
- Save your liked opportunities
- Let you view and apply to saved opportunities

## Troubleshooting

**"Missing API key" error:**

- Make sure your `.env` file has the correct `GEMINI_API_KEY`
- Restart the servers after adding the key

**"No opportunities found":**

- The app will automatically generate opportunities on first load
- Click the refresh button to trigger more opportunity generation

**Port already in use:**

- Change the PORT in `.env` to something else (like 3002)
- Or stop other processes using ports 3000/3001

Enjoy discovering healthcare opportunities! 🏥❤️
