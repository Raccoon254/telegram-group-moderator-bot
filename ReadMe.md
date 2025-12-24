# Group Guard Bot

A production-ready Telegram group moderation bot with a live dashboard API. Automatically detects, warns, and removes users who post sexual solicitation, hookup spam, and inappropriate content in Telegram groups.

Live Dashboard: [https://mod7.vercel.app/](https://mod7.vercel.app/)

Created by Kentom - [https://kentom.co.ke](https://kentom.co.ke)

## Features

- Automatic detection of sexual solicitation and spam
- Context-aware filtering using keyword combinations
- Supports English, Swahili, Sheng, and common misspellings
- PostgreSQL database for persistent storage
- RESTful API for dashboard integration
- Real-time updates via Server-Sent Events (SSE)
- Warning system with automatic ban on repeat offenses
- Comprehensive logging and error handling

## Architecture

- Backend: Node.js with Express
- Database: PostgreSQL with Prisma ORM
- Bot Framework: node-telegram-bot-api
- Real-time: Server-Sent Events (SSE)

## Prerequisites

- Node.js 16 or higher
- PostgreSQL database
- Telegram bot token (from @BotFather)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-repo/group-guard-bot.git
cd group-guard-bot
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
BOT_TOKEN=your_telegram_bot_token
DATABASE_URL=postgresql://user:password@localhost:5432/groupguard
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. Run database migrations:

```bash
npm run prisma:migrate
```

## Getting a Bot Token

1. Open Telegram and search for @BotFather
2. Start a chat and send `/newbot`
3. Follow prompts to choose a name and username
4. Copy the bot token provided
5. Add token to your `.env` file

Keep this token private and never commit it to version control.

## Adding Bot to Your Group

1. Open your Telegram group
2. Add the bot as a member
3. Promote bot to administrator
4. Grant these permissions:
   - Delete messages
   - Ban users
   - Restrict members

Without these permissions, the bot will not function.

## Running the Bot

Development mode with auto-reload:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Endpoints

The bot exposes a RESTful API for dashboard integration:

### GET /api/health

Health check endpoint

Response:
```json
{
  "success": true,
  "message": "Group Guard API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/logs

Get recent violations

Query params:
- `limit` (optional, default: 50)

Response:
```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

### GET /api/users

Get all users with warning counts

Response:
```json
{
  "success": true,
  "count": 25,
  "data": [...]
}
```

### GET /api/stats

Get overall statistics

Response:
```json
{
  "success": true,
  "data": {
    "totalUsers": 100,
    "totalWarnings": 45,
    "totalViolations": 60,
    "totalBans": 15
  }
}
```

### GET /api/violations/:userId

Get violation history for specific user

Response:
```json
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

### GET /api/events

Server-Sent Events endpoint for real-time updates

Connect to this endpoint to receive live violation events:

```javascript
const eventSource = new EventSource('http://localhost:3000/api/events')

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log('Event:', data)
}
```

## Database Management

View database in Prisma Studio:

```bash
npm run prisma:studio
```

Create a new migration:

```bash
npm run prisma:migrate
```

Deploy migrations to production:

```bash
npm run prisma:deploy
```

## Moderation Logic

The bot uses context-aware detection with keyword combinations:

- Sexual intent + call to action (e.g., "horny" + "dm")
- Video/VC references + call to action (e.g., "video call" + "inbox")
- Commercial offers + sexual context (e.g., "sugar mummy" + "video")
- Phone numbers + solicitation context

Some explicit terms trigger immediate violation.

Keyword groups can be customized in `src/utils/constants.js`.

## Moderation Flow

1. User sends a message
2. Bot analyzes message content
3. If violation detected:
   - Message is deleted
   - User info stored in database
   - Warning count incremented
4. First offense: Warning issued
5. Second offense: User banned from group
6. All events logged to database
7. Real-time events broadcast to dashboard

## Project Structure

```
chuka-mod/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/                # Configuration files
│   ├── controllers/           # API request handlers
│   ├── services/              # Business logic
│   ├── middleware/            # Express middleware
│   ├── routes/                # API routes
│   ├── utils/                 # Utilities and constants
│   ├── app.js                 # Express app setup
│   └── server.js              # Entry point
├── logs/                      # Application logs
├── .env                       # Environment variables
└── package.json
```

## Deployment

The bot can be deployed on:

- Render (recommended for bot + database)
- Railway
- Fly.io
- VPS (DigitalOcean, Linode, etc.)

For production deployment:

1. Set `NODE_ENV=production` in environment
2. Use managed PostgreSQL (Render, Supabase, Railway)
3. Run `npm run prisma:deploy` for migrations
4. Ensure bot has proper permissions in groups

## Security

- Never commit `.env` file to version control
- Rotate bot token if exposed
- Use strong PostgreSQL credentials
- Restrict API access with CORS if needed
- Keep dependencies updated

## Logging

Logs are stored in the `logs/` directory:

- `error.log` - Error-level logs only
- `combined.log` - All logs

Log level can be configured via `LOG_LEVEL` environment variable.

## Customization

Modify keyword detection in `src/utils/constants.js`:

- `INTENT_WORDS` - Sexual intent indicators
- `ACTION_WORDS` - Calls to action
- `MEDIA_WORDS` - Video/VC references
- `COMMERCIAL_WORDS` - Pricing indicators
- `HARD_BAN_WORDS` - Instant violation triggers

Adjust moderation logic in `src/services/moderation.service.js`.

## License

MIT License

## Author

Group Guard Bot  
Created by Kentom  
[https://kentom.co.ke](https://kentom.co.ke)

For customization, deployment, or enterprise moderation solutions, contact via kentom.co.ke.
