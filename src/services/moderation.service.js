/**
 * Moderation service - Violation detection engine
 */

const {
  INTENT_WORDS,
  ACTION_WORDS,
  MEDIA_WORDS,
  COMMERCIAL_WORDS,
  HARD_BAN_WORDS,
  PHONE_REGEX,
  VIOLATION_TYPES
} = require('../utils/constants')

/**
 * Check if text contains any words from a list
 */
function contains(text, wordList) {
  return wordList.some(word => text.includes(word))
}

/**
 * Detect if a message contains sexual content or solicitation
 * @param {string} text - Message text to analyze
 * @returns {boolean} - True if violation detected
 */
function isSexualMessage(text = '') {
  const t = text.toLowerCase()

  // Instant ban words
  if (contains(t, HARD_BAN_WORDS)) {
    return true
  }

  const intent = contains(t, INTENT_WORDS)
  const action = contains(t, ACTION_WORDS)
  const media = contains(t, MEDIA_WORDS)
  const commercial = contains(t, COMMERCIAL_WORDS)
  const phone = PHONE_REGEX.test(t)

  // Combination rules
  if (intent && (action || media)) return true
  if (media && action) return true
  if (commercial && (action || media)) return true
  if (phone && (intent || media || action)) return true
  if (t.includes('vc') && t.includes('dm')) return true

  // Extra heuristics: treat "shots" combined with these keywords as sexual
  if (t.includes('shots') && ['nightstand', 'serious guy', 'quickie'].some(k => t.includes(k))) return true

  return false
}

/**
 * Determine violation type
 * @param {string} text - Message text
 * @returns {string} - Violation type
 */
function getViolationType(text = '') {
  const t = text.toLowerCase()
  
  if (PHONE_REGEX.test(t)) {
    return VIOLATION_TYPES.PHONE_NUMBER
  }
  
  return VIOLATION_TYPES.SEXUAL
}

module.exports = {
  isSexualMessage,
  getViolationType
}
