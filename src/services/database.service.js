/**
 * Database service - All database operations
 */

const prisma = require('../config/database')
const logger = require('../utils/logger')

/**
 * Create or update user from Telegram user object
 */
async function createOrUpdateUser(telegramUser) {
  try {
    const user = await prisma.user.upsert({
      where: { telegramId: BigInt(telegramUser.id) },
      update: {
        username: telegramUser.username || null,
        firstName: telegramUser.first_name || null
      },
      create: {
        telegramId: BigInt(telegramUser.id),
        username: telegramUser.username || null,
        firstName: telegramUser.first_name || null
      }
    })
    return user
  } catch (error) {
    logger.error('Error creating/updating user:', error)
    throw error
  }
}

/**
 * Increment warning count for a user
 */
async function incrementWarning(userId) {
  try {
    const warning = await prisma.warning.upsert({
      where: { userId },
      update: {
        count: { increment: 1 },
        lastWarning: new Date()
      },
      create: {
        userId,
        count: 1,
        lastWarning: new Date()
      }
    })
    return warning
  } catch (error) {
    logger.error('Error incrementing warning:', error)
    throw error
  }
}

/**
 * Log a violation to the database
 */
async function logViolation(userId, message, violationType, actionTaken) {
  try {
    const violation = await prisma.violation.create({
      data: {
        userId,
        message,
        violationType,
        actionTaken
      },
      include: {
        user: true
      }
    })
    return violation
  } catch (error) {
    logger.error('Error logging violation:', error)
    throw error
  }
}

/**
 * Get warning count for a user
 */
async function getUserWarnings(userId) {
  try {
    const warning = await prisma.warning.findUnique({
      where: { userId }
    })
    return warning?.count || 0
  } catch (error) {
    logger.error('Error getting user warnings:', error)
    return 0
  }
}

/**
 * Get recent violations with user info
 */
async function getRecentViolations(limit = 50) {
  try {
    const violations = await prisma.violation.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            telegramId: true,
            username: true,
            firstName: true
          }
        }
      }
    })
    
    // Convert BigInt to string for JSON serialization
    return violations.map(v => ({
      ...v,
      user: {
        ...v.user,
        telegramId: v.user.telegramId.toString()
      }
    }))
  } catch (error) {
    logger.error('Error getting recent violations:', error)
    throw error
  }
}

/**
 * Get all violations for a specific user
 */
async function getUserViolations(userId) {
  try {
    const violations = await prisma.violation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            telegramId: true,
            username: true,
            firstName: true
          }
        }
      }
    })
    
    return violations.map(v => ({
      ...v,
      user: {
        ...v.user,
        telegramId: v.user.telegramId.toString()
      }
    }))
  } catch (error) {
    logger.error('Error getting user violations:', error)
    throw error
  }
}

/**
 * Get all users with their warning counts
 */
async function getUsersWithWarnings() {
  try {
    const users = await prisma.user.findMany({
      include: {
        warning: true
      },
      orderBy: {
        warning: {
          count: 'desc'
        }
      }
    })
    
    return users.map(u => ({
      ...u,
      telegramId: u.telegramId.toString(),
      warningCount: u.warning?.count || 0
    }))
  } catch (error) {
    logger.error('Error getting users with warnings:', error)
    throw error
  }
}

/**
 * Get overall statistics
 */
async function getStats() {
  try {
    const [totalUsers, totalWarnings, totalViolations, violationsByType] = await Promise.all([
      prisma.user.count(),
      prisma.warning.aggregate({
        _sum: { count: true }
      }),
      prisma.violation.count(),
      prisma.violation.groupBy({
        by: ['actionTaken'],
        _count: true
      })
    ])

    const bans = violationsByType.find(v => v.actionTaken === 'banned')?._count || 0
    const warnings = violationsByType.find(v => v.actionTaken === 'warned')?._count || 0

    return {
      totalUsers,
      totalWarnings: totalWarnings._sum.count || 0,
      totalViolations,
      totalBans: bans,
      totalWarningsIssued: warnings,
      violationsByType
    }
  } catch (error) {
    logger.error('Error getting stats:', error)
    throw error
  }
}

module.exports = {
  createOrUpdateUser,
  incrementWarning,
  logViolation,
  getUserWarnings,
  getRecentViolations,
  getUserViolations,
  getUsersWithWarnings,
  getStats
}
