/**
 * Constants and configuration values
 */

// Sexual intent keywords
const INTENT_WORDS = [
  'horny', 'smash', 'fuck', 'fuckmate', 'bj', 'nasty',
  'naked', 'nudes', 'moaning', 'kumwagiwa', 'uchi',
  'nkupanua', 'nkipanua', 'umwage', 'dick'
]

// Contact / call to action keywords
const ACTION_WORDS = [
  'dm', 'inbox', 'txt', 'text', 'whatsapp', 'whatsap',
  'call', 'message', 'reach'
]

// Video / media keywords
const MEDIA_WORDS = [
  'vc', 'video', 'videocall', 'video call', 'vedio',
  'vedio col', 'live'
]

// Money / offers keywords
const COMMERCIAL_WORDS = [
  'price', 'bob', '100', 'shots', 'nightstand',
  'sleep over', 'sleepover', 'sugar mummy',
  'sugar daddy', 'connection'
]

// Hard-ban words (single word = instant violation)
const HARD_BAN_WORDS = [
  'kuma', 'kudinywa', 'kunyonya'
]

// Phone number regex pattern
const PHONE_REGEX = /\b(0|\+254)?\d{9}\b/

// Violation types
const VIOLATION_TYPES = {
  SEXUAL: 'sexual',
  PHONE_NUMBER: 'phone_number',
  SPAM: 'spam'
}

// Actions taken
const ACTIONS = {
  WARNED: 'warned',
  KICKED: 'kicked',
  BANNED: 'banned'
}

// API configuration
const API_CONFIG = {
  DEFAULT_LOGS_LIMIT: 50,
  SSE_HEARTBEAT_INTERVAL: 30000 // 30 seconds
}

module.exports = {
  INTENT_WORDS,
  ACTION_WORDS,
  MEDIA_WORDS,
  COMMERCIAL_WORDS,
  HARD_BAN_WORDS,
  PHONE_REGEX,
  VIOLATION_TYPES,
  ACTIONS,
  API_CONFIG
}
