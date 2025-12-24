/**
 * Express application setup
 */

const express = require('express')
const cors = require('cors')
const apiRoutes = require('./routes/api.routes')
const sseRoutes = require('./routes/sse.routes')
const requestLogger = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(requestLogger)

// Routes
app.use('/api', apiRoutes)
app.use('/api', sseRoutes)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Group Guard API',
    version: '1.0.0',
    description: 'Telegram group moderation bot with live dashboard',
    endpoints: {
      health: '/api/health',
      logs: '/api/logs',
      users: '/api/users',
      stats: '/api/stats',
      violations: '/api/violations/:userId',
      events: '/api/events (SSE)'
    }
  })
})

// Error handling (must be last)
app.use(errorHandler)

module.exports = app
