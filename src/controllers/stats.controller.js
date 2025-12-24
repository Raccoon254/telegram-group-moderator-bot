/**
 * Stats controller - Handle statistics API requests
 */

const { getStats } = require('../services/database.service')
const logger = require('../utils/logger')

/**
 * GET /api/stats
 * Get overall statistics
 */
async function getStatistics(req, res, next) {
  try {
    const stats = await getStats()
    
    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    logger.error('Error in getStatistics controller:', error)
    next(error)
  }
}

module.exports = {
  getStatistics
}
