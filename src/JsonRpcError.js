
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

class ParseError extends JsonRpcError {
  constructor(message, data) {
    super(
      CODES.parse,
      message || getMessageFromCode(CODES.parse),
      data
    )
  }
}

class InvalidRequestError extends JsonRpcError {
  constructor(message, data) {
    super(
      CODES.invalidRequest,
      message || getMessageFromCode(CODES.invalidRequest),
      data
    )
  }
}

class MethodNotFoundError extends JsonRpcError {
  constructor(message, data) {
    super(
      CODES.methodNotFound,
      message || getMessageFromCode(CODES.methodNotFound),
      data
    )
  }
}

class InvalidParamsError extends JsonRpcError {
  constructor(message, data) {
    super(
      CODES.invalidParams,
      message || getMessageFromCode(CODES.invalidParams),
      data
    )
  }
}

class InternalError extends JsonRpcError {
  constructor(message, data) {
    super(
      CODES.internal,
      message || getMessageFromCode(CODES.internal),
      data
    )
  }
}

class ServerError extends JsonRpcError {
  constructor(code, message, data) {
    if (!Number.isInteger(code) || code > -32000 || code < -32099) {
      throw new Error(
        '"code" must be an integer such that: -32099 <= code <= -32000'
      )
    }
    super(
      code, message || getMessageFromCode(code), data
    )
  }
}

module.exports = {
  errors: {
    parse: (message, data) => new ParseError(message, data),
    invalidRequest: (message, data) => new InvalidRequestError(message, data),
    invalidParams: (message, data) => new InvalidParamsError(message, data),
    methodNotFound: (message, data) => new MethodNotFoundError(message, data),
    internal: (message, data) => new InternalError(message, data),
    server: (code, message, data) => new ServerError(code, message, data),
  },
  JsonRpcError,
}
