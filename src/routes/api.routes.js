/**
 * API routes
 */

const express = require('express')
const { getLogs } = require('../controllers/logs.controller')
const { getUsers } = require('../controllers/users.controller')
const { getStatistics } = require('../controllers/stats.controller')
const { getUserViolationHistory } = require('../controllers/violations.controller')

const router = express.Router()

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Group Guard API is running',
    timestamp: new Date().toISOString()
  })
})

// Logs endpoint
router.get('/logs', getLogs)

// Users endpoint
router.get('/users', getUsers)

// Stats endpoint
router.get('/stats', getStatistics)

// User violations endpoint
router.get('/violations/:userId', getUserViolationHistory)

module.exports = router
