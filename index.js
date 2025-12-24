/**
 * 🛡️ Group Guard Bot
 * Smart Telegram moderation bot
 * Created by Kentom — https://kentom.co.ke
 */

require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })

// ==============================
// ⚠️ In-memory warnings
// (Use Redis / DB in production)
// ==============================
const warnings = new Map()

// ==============================
// 🔍 Keyword Groups
// ==============================

// Sexual intent
const intentWords = [
  'horny', 'smash', 'fuck', 'fuckmate', 'bj', 'nasty',
  'naked', 'nudes', 'moaning', 'kumwagiwa', 'uchi',
  'nkupanua', 'nkipanua', 'umwage', 'dick'
]

// Contact / call to action
const actionWords = [
  'dm', 'inbox', 'txt', 'text', 'whatsapp', 'whatsap',
  'call', 'message', 'reach'
]

// Video / media
const mediaWords = [
  'vc', 'video', 'videocall', 'video call', 'vedio',
  'vedio col', 'live'
]

// Money / offers
const commercialWords = [
  'price', 'bob', '100', 'shots', 'nightstand',
  'sleep over', 'sleepover', 'sugar mummy',
  'sugar daddy', 'connection'
]

// 🚫 Hard-ban words (single word = violation)
const hardBanWords = [
  'kuma', 'kudinywa', 'kunyonya'
]

// Phone number regex
const phoneRegex = /\b(0|\+254)?\d{9}\b/

// ==============================
// 🧠 Detection Engine
// ==============================
function contains(text, list) {
  return list.some(word => text.includes(word))
}

function isSexualMessage(text = '') {
  const t = text.toLowerCase()

  // Instant ban words
  if (contains(t, hardBanWords)) return true

  const intent = contains(t, intentWords)
  const action = contains(t, actionWords)
  const media = contains(t, mediaWords)
  const commercial = contains(t, commercialWords)
  const phone = phoneRegex.test(t)

  // Combination rules
  if (intent && (action || media)) return true
  if (media && action) return true
  if (commercial && (action || media)) return true
  if (phone && (intent || media || action)) return true
  if (t.includes('vc') && t.includes('dm')) return true

  return false
}

// ==============================
// 🤖 Message Handler
// ==============================
bot.on('message', async (msg) => {
  const chatId = msg.chat.id
  const userId = msg.from.id
  const text = msg.text || ''

  if (!text || msg.from.is_bot) return

  try {
    if (isSexualMessage(text)) {

      // Delete message
      await bot.deleteMessage(chatId, msg.message_id)

      const count = (warnings.get(userId) || 0) + 1
      warnings.set(userId, count)

      const userTag = msg.from.username
        ? `@${msg.from.username}`
        : msg.from.first_name

      if (count === 1) {
        // ⚠️ Warning
        await bot.sendMessage(
          chatId,
          `⚠️ <b>Warning</b>\n${userTag}\nSexual solicitation is not allowed in this group.\n\nNext offense = removal.\n\n🛡️ Group Guard • kentom.co.ke`,
          { parse_mode: 'HTML' }
        )
      } else {
        // 🚫 Ban user
        await bot.banChatMember(chatId, userId)

        await bot.sendMessage(
          chatId,
          `🚫 <b>User Removed</b>\n${userTag}\nRepeated sexual solicitation.\n\n🛡️ Group Guard • kentom.co.ke`,
          { parse_mode: 'HTML' }
        )
      }
    }
  } catch (err) {
    console.error('Bot error:', err.message)
  }
})

console.log('🛡️ Group Guard running — https://kentom.co.ke')