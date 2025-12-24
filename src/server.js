/**
 * Server entry point
 * Starts Express API server and Telegram bot
 */

require('dotenv').config()
const app = require('./app')
const { initializeBotHandlers } = require('./services/bot.service')
const logger = require('./utils/logger')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 3000

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

// Start Express server
const server = app.listen(PORT, () => {
  logger.info(`API server running on port ${PORT}`)
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
})

// Initialize Telegram bot
initializeBotHandlers()
logger.info('Group Guard Bot initialized')

// Graceful shutdown
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

function shutdown() {
  logger.info('Shutting down gracefully...')
  
  server.close(() => {
    logger.info('HTTP server closed')
    process.exit(0)
  })

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout')
    process.exit(1)
  }, 10000)
}
