/**
 * Violations controller - Handle user-specific violations
 */

const { getUserViolations } = require('../services/database.service')
const logger = require('../utils/logger')

/**
 * GET /api/violations/:userId
 * Get violation history for a specific user
 */
async function getUserViolationHistory(req, res, next) {
  try {
    const userId = parseInt(req.params.userId)
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      })
    }
    
    const violations = await getUserViolations(userId)
    
    res.json({
      success: true,
      count: violations.length,
      data: violations
    })
  } catch (error) {
    logger.error('Error in getUserViolationHistory controller:', error)
    next(error)
  }
}

module.exports = {
  getUserViolationHistory
}
