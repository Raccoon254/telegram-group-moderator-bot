/**
 * Logs controller - Handle violation logs API
 */

const { getRecentViolations } = require('../services/database.service')
const { API_CONFIG } = require('../utils/constants')
const logger = require('../utils/logger')

/**
 * GET /api/logs
 * Get recent violations
 */
async function getLogs(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || API_CONFIG.DEFAULT_LOGS_LIMIT
    const violations = await getRecentViolations(limit)
    
    res.json({
      success: true,
      count: violations.length,
      data: violations
    })
  } catch (error) {
    logger.error('Error in getLogs controller:', error)
    next(error)
  }
}

module.exports = {
  getLogs
}
