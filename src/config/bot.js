/**
 * Telegram bot configuration
 */

const TelegramBot = require('node-telegram-bot-api')
const logger = require('../utils/logger')

if (!process.env.BOT_TOKEN) {
  logger.error('BOT_TOKEN is not defined in environment variables')
  process.exit(1)
}

const bot = new TelegramBot(process.env.BOT_TOKEN, { 
  polling: true 
})

bot.on('polling_error', (error) => {
  logger.error('Polling error:', error)
})

module.exports = bot
