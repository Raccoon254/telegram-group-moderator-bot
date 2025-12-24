/**
 * Server-Sent Events (SSE) routes for real-time updates
 */

const express = require('express')
const violationEmitter = require('../utils/eventEmitter')
const logger = require('../utils/logger')
const { API_CONFIG } = require('../utils/constants')

const router = express.Router()

/**
 * GET /api/events
 * SSE endpoint for real-time violation updates
 */
router.get('/events', (req, res) => {
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Send initial connection message
  res.write('data: {"type":"connected","message":"Connected to Group Guard events"}\n\n')

  logger.info('SSE client connected')

  // Violation event handler
  const violationHandler = (violation) => {
    res.write(`data: ${JSON.stringify({ type: 'violation', data: violation })}\n\n`)
  }

  // Warning event handler
  const warningHandler = (warning) => {
    res.write(`data: ${JSON.stringify({ type: 'warning', data: warning })}\n\n`)
  }

  // Ban event handler
  const banHandler = (ban) => {
    res.write(`data: ${JSON.stringify({ type: 'ban', data: ban })}\n\n`)
  }

  // Register event listeners
  violationEmitter.on('violation', violationHandler)
  violationEmitter.on('warning', warningHandler)
  violationEmitter.on('ban', banHandler)

  // Send heartbeat every 30 seconds to keep connection alive
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n')
  }, API_CONFIG.SSE_HEARTBEAT_INTERVAL)

  // Cleanup on client disconnect
  req.on('close', () => {
    clearInterval(heartbeat)
    violationEmitter.off('violation', violationHandler)
    violationEmitter.off('warning', warningHandler)
    violationEmitter.off('ban', banHandler)
    logger.info('SSE client disconnected')
    res.end()
  })
})

module.exports = router
