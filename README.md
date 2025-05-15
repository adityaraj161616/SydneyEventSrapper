# Sydney Event Scraper with Gemini AI Backup

A web application that automatically scrapes events in Sydney, Australia and displays them beautifully on a web page. When traditional scraping fails (due to dynamic content, anti-bot protection, or page structure changes), it uses the Google Gemini API as an AI backup to extract or generate event details.

![Sydney Event Scraper Screenshot](/placeholder.svg?height=400&width=800)

## 🌟 Features

- **Smart Scraping Engine**: Uses Puppeteer to scrape Sydney events from popular sites
- **AI Backup**: Falls back to Google Gemini AI when traditional scraping fails
- **Beautiful UI**: Responsive design with filtering and search capabilities
- **Email Capture**: Collects user emails before redirecting to ticket pages
- **Admin Dashboard**: Monitor events, subscriptions, and trigger manual scrapes
- **Automated Updates**: Scheduled scraping to keep event data fresh

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Scraping**: Puppeteer
- **AI**: Google Gemini API (via @google/generative-ai)
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB database
- Google Gemini API key

## 🚀 Getting Started

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/sydney-event-scraper.git
   cd sydney-event-scraper
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DB=sydney_events
   GEMINI_API_KEY=your_gemini_api_key
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Initial Setup

1. Trigger the initial scrape by visiting `/api/scrape` in your browser or using a tool like Postman.
2. Check the admin dashboard at `/admin` to see statistics about scraped events.

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `MONGODB_DB` | MongoDB database name (default: 'sydney_events') | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |

## 📚 Project Structure

\`\`\`
sydney-event-scraper/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   │   ├── events/         # Events API
│   │   ├── email/          # Email subscription API
│   │   ├── scrape/         # Manual scrape trigger API
│   │   └── subscriptions/  # Subscriptions API
│   ├── admin/              # Admin dashboard
│   ├── cron/               # Cron job endpoint
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── components/             # React components
│   ├── email-modal.tsx     # Email capture modal
│   ├── event-card.tsx      # Event card component
│   ├── event-filter.tsx    # Event filtering component
│   └── theme-provider.tsx  # Theme provider
├── lib/                    # Utility functions
│   ├── gemini.ts           # Gemini AI integration
│   ├── mongodb.ts          # MongoDB connection
│   └── scraper.ts          # Web scraping logic
├── types/                  # TypeScript type definitions
│   └── event.ts            # Event type definition
└── public/                 # Static assets
\`\`\`

## 🔄 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/events` | GET | Get all events |
| `/api/email` | POST | Store user email subscription |
| `/api/scrape` | GET | Manually trigger scraping |
| `/api/subscriptions` | GET | Get all email subscriptions |
| `/cron` | GET | Endpoint for scheduled scraping |

## 📱 Usage

### Main Page

The main page displays all scraped events in a grid layout. Users can:
- Filter events by category, date, and location
- Click "Get Tickets" to be redirected to the event page (after providing their email)

### Admin Dashboard

The admin dashboard at `/admin` provides:
- Statistics about events and subscriptions
- A button to manually trigger scraping
- Tables of all events and subscriptions

### Setting Up Scheduled Scraping

To keep your event data fresh, set up a scheduled job to trigger the scraper:

1. **Using Vercel Cron Jobs**:
   - In your Vercel dashboard, go to Settings > Cron Jobs
   - Add a new cron job that hits your `/cron` endpoint
   - Set it to run daily (e.g., `0 0 * * *` for midnight every day)

2. **Alternative: External Cron Service**:
   - You can use services like Uptime Robot, Cronitor, or GitHub Actions
   - Set up a job to make a GET request to your `/cron` endpoint

## 🚢 Deployment

This project is designed to be deployed on Vercel:

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Set up the environment variables in the Vercel dashboard
4. Deploy the project

## 🧩 How It Works

### Scraping Process

1. The scraper attempts to extract events using traditional web scraping techniques
2. If traditional scraping fails, it falls back to the Gemini AI:
   - It sends the raw HTML or text content to the Gemini API
   - The API analyzes the content and extracts structured event data
   - The extracted data is stored in the database

### Email Capture

When a user clicks "Get Tickets":
1. They're prompted to enter their email
2. The email is stored in the database along with the event details
3. The user is redirected to the original event page

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [MongoDB](https://www.mongodb.com/)
- [Puppeteer](https://pptr.dev/)
- [Google Generative AI](https://ai.google.dev/)
