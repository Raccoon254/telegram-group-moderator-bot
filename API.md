# Group Guard API Documentation

Base URL: `https://telegram-group-moderator-bot.onrender.com`

Live Dashboard: `https://mod7.vercel.app/`

## Overview

The Group Guard API provides endpoints for accessing moderation data, user statistics, violation logs, and real-time updates for the Telegram Group Guard bot.

All endpoints return JSON responses with the following structure:
```json
{
  "success": true,
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Endpoints

### 1. Health Check

Check if the API is running.

**Endpoint:** `GET /api/health`

**Example:**
```bash
curl https://telegram-group-moderator-bot.onrender.com/api/health
```

**Response:**
```json
{
  "success": true,
  "message": "Group Guard API is running",
  "timestamp": "2025-12-24T12:21:25.396Z"
}
```

---

### 2. Get API Information

Get API metadata and available endpoints.

**Endpoint:** `GET /`

**Example:**
```bash
curl https://telegram-group-moderator-bot.onrender.com/
```

**Response:**
```json
{
  "name": "Group Guard API",
  "version": "1.0.0",
  "description": "Telegram group moderation bot with live dashboard",
  "endpoints": {
    "health": "/api/health",
    "logs": "/api/logs",
    "users": "/api/users",
    "stats": "/api/stats",
    "violations": "/api/violations/:userId",
    "events": "/api/events (SSE)"
  }
}
```

---

### 3. Get Statistics

Get overall moderation statistics.

**Endpoint:** `GET /api/stats`

**Example:**
```bash
curl https://telegram-group-moderator-bot.onrender.com/api/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 100,
    "totalWarnings": 45,
    "totalViolations": 60,
    "totalBans": 15,
    "totalWarningsIssued": 45,
    "violationsByType": [
      {
        "_count": 45,
        "actionTaken": "warned"
      },
      {
        "_count": 15,
        "actionTaken": "banned"
      }
    ]
  }
}
```

---

### 4. Get Users

Get all users with their warning counts, sorted by warnings (descending).

**Endpoint:** `GET /api/users`

**Example:**
```bash
curl https://telegram-group-moderator-bot.onrender.com/api/users
```

**Response:**
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "id": 1,
      "telegramId": "123456789",
      "username": "john_doe",
      "firstName": "John",
      "createdAt": "2025-12-24T10:00:00.000Z",
      "warning": {
        "id": 1,
        "userId": 1,
        "count": 2,
        "lastWarning": "2025-12-24T12:00:00.000Z"
      },
      "warningCount": 2
    }
  ]
}
```

---

### 5. Get Violation Logs

Get recent violations with user information.

**Endpoint:** `GET /api/logs`

**Query Parameters:**
- `limit` (optional, default: 50) - Number of violations to return

**Examples:**
```bash
# Get last 50 violations (default)
curl https://telegram-group-moderator-bot.onrender.com/api/logs

# Get last 10 violations
curl https://telegram-group-moderator-bot.onrender.com/api/logs?limit=10

# Get last 100 violations
curl https://telegram-group-moderator-bot.onrender.com/api/logs?limit=100
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "message": "SHOTS ama NIGHTSTAND available for any serious guy now",
      "violationType": "sexual",
      "actionTaken": "warned",
      "createdAt": "2025-12-24T12:20:02.786Z",
      "user": {
        "telegramId": "123456789",
        "username": "john_doe",
        "firstName": "John"
      }
    }
  ]
}
```

**Violation Types:**
- `sexual` - Sexual solicitation or inappropriate content
- `phone_number` - Phone number with solicitation context
- `spam` - Spam or unwanted content

**Action Types:**
- `warned` - User received a warning (first offense)
- `banned` - User was banned from the group (repeat offense)
- `kicked` - User was kicked from the group

---

### 6. Get User Violations

Get violation history for a specific user.

**Endpoint:** `GET /api/violations/:userId`

**Parameters:**
- `userId` (required) - Internal user ID (from database, not Telegram ID)

**Example:**
```bash
curl https://telegram-group-moderator-bot.onrender.com/api/violations/1
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 3,
      "userId": 1,
      "message": "third violation message",
      "violationType": "sexual",
      "actionTaken": "banned",
      "createdAt": "2025-12-24T14:00:00.000Z",
      "user": {
        "telegramId": "123456789",
        "username": "john_doe",
        "firstName": "John"
      }
    },
    {
      "id": 2,
      "userId": 1,
      "message": "second violation message",
      "violationType": "sexual",
      "actionTaken": "warned",
      "createdAt": "2025-12-24T13:00:00.000Z",
      "user": {
        "telegramId": "123456789",
        "username": "john_doe",
        "firstName": "John"
      }
    }
  ]
}
```

**Error Response (Invalid User ID):**
```json
{
  "success": false,
  "error": "Invalid user ID"
}
```

---

### 7. Real-time Events (SSE)

Subscribe to real-time violation events using Server-Sent Events.

**Endpoint:** `GET /api/events`

**Event Types:**
- `connected` - Initial connection confirmation
- `violation` - New violation detected
- `warning` - Warning issued to user
- `ban` - User banned from group

**JavaScript Example:**
```javascript
const eventSource = new EventSource('https://telegram-group-moderator-bot.onrender.com/api/events')

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log('Event received:', data)
  
  if (data.type === 'warning') {
    console.log('User warned:', data.data.user.username)
  } else if (data.type === 'ban') {
    console.log('User banned:', data.data.user.username)
  }
}

eventSource.onerror = (error) => {
  console.error('SSE error:', error)
}
```

**cURL Example:**
```bash
curl -N -H "Accept: text/event-stream" https://telegram-group-moderator-bot.onrender.com/api/events
```

**Event Format:**
```json
{
  "type": "warning",
  "data": {
    "user": {
      "telegramId": "123456789",
      "username": "john_doe",
      "firstName": "John"
    },
    "message": "violating message content",
    "violationType": "sexual",
    "action": "warned",
    "timestamp": "2025-12-24T12:20:00.000Z"
  }
}
```

**Connection Notes:**
- Connection stays open indefinitely
- Heartbeat sent every 30 seconds to keep connection alive
- Reconnect automatically if connection drops

---

## Rate Limiting

Currently, there are no rate limits on the API. However, please be respectful and avoid excessive requests.

---

## CORS

CORS is enabled for all origins (`*`). You can call these endpoints from any frontend application.

---

## Error Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 400 | Bad Request (e.g., invalid user ID) |
| 404 | Resource Not Found |
| 409 | Conflict (e.g., duplicate resource) |
| 500 | Internal Server Error |

---

## Example Integration (SvelteKit)

```javascript
// Fetch recent violations
async function getRecentViolations(limit = 10) {
  const response = await fetch(
    `https://telegram-group-moderator-bot.onrender.com/api/logs?limit=${limit}`
  )
  const data = await response.json()
  return data.data
}

// Subscribe to real-time events
function subscribeToEvents(onEvent) {
  const eventSource = new EventSource(
    'https://telegram-group-moderator-bot.onrender.com/api/events'
  )
  
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)
    onEvent(data)
  }
  
  return eventSource
}

// Get statistics
async function getStats() {
  const response = await fetch(
    'https://telegram-group-moderator-bot.onrender.com/api/stats'
  )
  const data = await response.json()
  return data.data
}
```

---

## Support

For issues or questions, contact via [kentom.co.ke](https://kentom.co.ke)

Created by Kentom
