
const getMessageFromCode = require('./utils').getMessageFromCode
const CODES = require('./errorCodes.json').jsonRpc

class JsonRpcError extends Error {

  constructor (code, message, data) {

    if (!Number.isInteger(code)) throw new Error(
      '"code" must be an integer.'
    )
    if (typeof message !== 'string') throw new Error(
      '"message" must be a string.'
    )

    super(message)
    this.code = code
    if (data !== undefined) this.data = data
  }

  serialize() {
    const serialized = {
      code: this.code,
      message: this.message,
    }
    if (this.data !== undefined) serialized.data = this.data
    if (this.stack) serialized.stack = this.stack
    return serialized
  }
}

function getError(code, message, data) {
  return new JsonRpcError(
    code,
    message || getMessageFromCode(code),
    data
  )
}

module.exports = {
  errors: {
    parse: (message, data) => getError(CODES.parse, message, data),
    invalidRequest: (message, data) => getError(
      CODES.invalidRequest, message, data
    ),
    invalidParams: (message, data) => getError(
      CODES.invalidParams, message, data
    ),
    methodNotFound: (message, data) => getError(
      CODES.methodNotFound, message, data
    ),
    internal: (message, data) => getError(CODES.internal, message, data),
    server: (code, message, data) => {
      if (!Number.isInteger(code) || code > -32000 || code < -32099) {
        throw new Error(
          '"code" must be an integer such that: -32099 <= code <= -32000'
        )
      }
      return getError(code, message, data)
    },
  },
  JsonRpcError,
}
