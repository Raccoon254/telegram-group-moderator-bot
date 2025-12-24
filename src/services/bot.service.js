/**
 * Telegram bot service - Message handling and moderation
 */

const bot = require('../config/bot')
const logger = require('../utils/logger')
const { isSexualMessage, getViolationType } = require('./moderation.service')
const { 
  createOrUpdateUser, 
  incrementWarning, 
  logViolation, 
  getUserWarnings 
} = require('./database.service')
const { ACTIONS } = require('../utils/constants')
const violationEmitter = require('../utils/eventEmitter')

/**
 * Initialize bot message handler
 */
function initializeBotHandlers() {
  bot.on('message', handleMessage)
  logger.info('Bot message handlers initialized')
}

/**
 * Handle incoming messages
 */
async function handleMessage(msg) {
  const chatId = msg.chat.id
  const userId = msg.from.id
  const text = msg.text || ''

  logger.info(`Message from ${msg.from.username || msg.from.first_name}: ${text}`)

  // Ignore empty messages and bot messages
  if (!text || msg.from.is_bot) return

  try {
    // Check for violations
    if (isSexualMessage(text)) {
      await handleViolation(msg)
    }
  } catch (error) {
    logger.error('Error handling message:', error)
  }
}

/**
 * Handle a detected violation
 */
async function handleViolation(msg) {
  const chatId = msg.chat.id
  const userId = msg.from.id
  const text = msg.text

  try {
    // Delete the violating message
    await bot.deleteMessage(chatId, msg.message_id)

    // Create or update user in database
    const user = await createOrUpdateUser(msg.from)

    // Get current warning count
    const currentWarnings = await getUserWarnings(user.id)
    const newWarningCount = currentWarnings + 1

    // Increment warnings
    await incrementWarning(user.id)

    const userTag = msg.from.username
      ? `@${msg.from.username}`
      : msg.from.first_name

    const violationType = getViolationType(text)

    if (newWarningCount === 1) {
      // First warning
      await logViolation(user.id, text, violationType, ACTIONS.WARNED)

      await bot.sendMessage(
        chatId,
        `<b>Warning</b>\n${userTag}\nSexual solicitation is not allowed in this group.\n\nNext offense = removal.\n\nGroup Guard • kentom.co.ke`,
        { parse_mode: 'HTML' }
      )

      // Emit warning event for real-time dashboard
      violationEmitter.emitWarning({
        user: {
          telegramId: msg.from.id.toString(),
          username: msg.from.username,
          firstName: msg.from.first_name
        },
        message: text,
        violationType,
        action: ACTIONS.WARNED,
        timestamp: new Date()
      })

      logger.info(`Warning issued to user ${userTag}`)
    } else {
      // Ban user
      await bot.banChatMember(chatId, userId)
      await logViolation(user.id, text, violationType, ACTIONS.BANNED)

      await bot.sendMessage(
        chatId,
        `<b>User Removed</b>\n${userTag}\nRepeated sexual solicitation.\n\nGroup Guard • kentom.co.ke`,
        { parse_mode: 'HTML' }
      )

      // Emit ban event for real-time dashboard
      violationEmitter.emitBan({
        user: {
          telegramId: msg.from.id.toString(),
          username: msg.from.username,
          firstName: msg.from.first_name
        },
        message: text,
        violationType,
        action: ACTIONS.BANNED,
        timestamp: new Date()
      })

      logger.info(`User ${userTag} banned from group`)
    }
  } catch (error) {
    logger.error('Error handling violation:', error)
  }
}

module.exports = {
  initializeBotHandlers
}
