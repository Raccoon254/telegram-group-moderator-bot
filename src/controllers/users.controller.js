/**
 * Users controller - Handle user-related API requests
 */

const { getUsersWithWarnings } = require('../services/database.service')
const logger = require('../utils/logger')

/**
 * GET /api/users
 * Get all users with their warning counts
 */
async function getUsers(req, res, next) {
  try {
    const users = await getUsersWithWarnings()
    
    res.json({
      success: true,
      count: users.length,
      data: users
    })
  } catch (error) {
    logger.error('Error in getUsers controller:', error)
    next(error)
  }
}

module.exports = {
  getUsers
}
