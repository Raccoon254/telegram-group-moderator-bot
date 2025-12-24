/**
 * Event emitter for real-time updates
 */

const EventEmitter = require('events')

class ViolationEmitter extends EventEmitter {
  emitViolation(violation) {
    this.emit('violation', violation)
  }

  emitWarning(warning) {
    this.emit('warning', warning)
  }

  emitBan(ban) {
    this.emit('ban', ban)
  }
}

// Singleton instance
const violationEmitter = new ViolationEmitter()

module.exports = violationEmitter
