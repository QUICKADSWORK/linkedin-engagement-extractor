# LinkedIn Engagement Extractor

A modern web application that extracts engagement data (reactions and comments) from LinkedIn posts, helping you identify and connect with engaged users for lead generation, community analysis, or relationship building.

![LinkedIn Engagement Extractor](https://img.shields.io/badge/LinkedIn-Engagement%20Extractor-0077b5?style=for-the-badge&logo=linkedin)

## Features

✨ **Extract Profile Data** - Get LinkedIn profile URLs from users who reacted to or commented on posts

📊 **Multiple Engagement Types** - Captures all reaction types (likes, celebrates, supports, loves, insightfuls) and comments

🎯 **Deduplication** - Automatically removes duplicate profiles

📥 **Export Options** - Download results as CSV or copy all URLs to clipboard

🔍 **Search & Filter** - Filter profiles by engagement type and search by name/headline

🎨 **Modern UI** - Beautiful, responsive dark-themed interface

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- A modern web browser

## Quick Start

### 1. Clone/Navigate to the project

```bash
cd linkedin-engagement-extractor
```

### 2. Set up the Backend

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables (create .env file)
echo "RAPIDAPI_KEY=56b6f4dce1mshc3398ebe2b7bdf7p1a8c18jsn91e4f7fa09ae" > .env
echo "FLASK_DEBUG=True" >> .env
echo "PORT=5000" >> .env

# Start the backend server
python app.py
```

The backend will start on `http://localhost:5001` (or 5000 if available)

### 3. Open the Frontend

In a new terminal:

```bash
cd linkedin-engagement-extractor/frontend

# Option 1: Use Python's built-in server
python3 -m http.server 8080

# Option 2: Use any static file server
# npx serve .
```

Open your browser and navigate to `http://localhost:8080`

## Usage

1. **Enter a LinkedIn Post URL**
   - Paste a LinkedIn post URL in the input field
   - Supported formats:
     - `https://www.linkedin.com/posts/...`
     - `https://www.linkedin.com/feed/update/...`
     - `https://www.linkedin.com/pulse/...`

2. **Extract Profiles**
   - Click "Extract Profiles" to fetch engagement data
   - Wait for the extraction to complete

3. **View & Export Results**
   - Browse the extracted profiles in the results table
   - Use filters to show only reactions or comments
   - Search profiles by name or headline
   - Download as CSV or copy all URLs

## Project Structure

```
linkedin-engagement-extractor/
├── backend/
│   ├── app.py              # Flask API server
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables (create this)
├── frontend/
│   ├── index.html         # Main HTML file
│   ├── styles.css         # Stylesheet
│   └── script.js          # Frontend JavaScript
└── README.md              # This file
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/extract` | POST | Extract engagement data from a LinkedIn post |
| `/api/download/csv` | POST | Generate and download CSV file |
| `/api/validate` | POST | Validate a LinkedIn post URL |

### Example Request

```bash
curl -X POST http://localhost:5001/api/extract \
  -H "Content-Type: application/json" \
  -d '{"post_url": "https://www.linkedin.com/posts/example-post-123"}'
```

### Example Response

```json
{
  "success": true,
  "data": {
    "profiles": [
      {
        "profile_url": "https://www.linkedin.com/in/johndoe",
        "name": "John Doe",
        "headline": "Software Engineer at Company",
        "engagement_type": "reaction",
        "reaction_type": "LIKE"
      }
    ],
    "total_count": 1,
    "reaction_count": 1,
    "comment_count": 0,
    "post_url": "https://www.linkedin.com/posts/example-post-123"
  }
}
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `RAPIDAPI_KEY` | Your RapidAPI key for LinkedIn data | (provided) |
| `FLASK_DEBUG` | Enable Flask debug mode | `True` |
| `PORT` | Backend server port | `5001` |

### API Key

The application uses the Fresh LinkedIn Profile Data API from RapidAPI. The API key is pre-configured, but you can replace it with your own:

1. Sign up at [RapidAPI](https://rapidapi.com)
2. Subscribe to the [Fresh LinkedIn Profile Data API](https://rapidapi.com/freshdata-freshdata-default/api/fresh-linkedin-profile-data)
3. Update the `RAPIDAPI_KEY` in your `.env` file

## Rate Limiting

The application respects API rate limits. If you encounter rate limiting:

- Wait a few minutes before making new requests
- Consider upgrading your RapidAPI plan for higher limits
- The application will display appropriate error messages

## Troubleshooting

### Backend won't start

```bash
# Make sure you're in the backend directory
cd backend

# Check Python version
python3 --version

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### CORS errors in browser

Make sure the backend is running on `http://localhost:5000` and CORS is enabled (it is by default).

### No profiles extracted

- Verify the LinkedIn post URL is correct and publicly accessible
- Some posts may have privacy restrictions
- The API may not have data for all posts

## Security Considerations

- Never expose your API key in client-side code
- The backend keeps the API key secure on the server
- Use HTTPS in production
- Respect LinkedIn's terms of service and data usage policies

## Production Deployment

For production deployment:

1. Set `FLASK_DEBUG=False`
2. Use a production WSGI server like Gunicorn:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```
3. Deploy frontend to a CDN or static hosting (Vercel, Netlify, etc.)
4. Update the `API_BASE_URL` in `script.js` to your production backend URL
5. Use environment variables for sensitive data

## License

This project is for educational and personal use. Ensure compliance with LinkedIn's terms of service when using extracted data.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

