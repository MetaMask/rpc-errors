
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
      errorValues.parse.code,
      message || errorValues.parse.message,
      data
    )
  }
}

class InvalidRequestError extends JsonRpcError {
  constructor(message, data) {
    super(
      errorValues.invalidRequest.code,
      message || errorValues.invalidRequest.message,
      data
    )
  }
}

class MethodNotFoundError extends JsonRpcError {
  constructor(message, data) {
    super(
      errorValues.methodNotFound.code,
      message || errorValues.methodNotFound.message,
      data
    )
  }
}

class InvalidParamsError extends JsonRpcError {
  constructor(message, data) {
    super(
      errorValues.invalidParams.code,
      message || errorValues.invalidParams.message,
      data
    )
  }
}

class InternalError extends JsonRpcError {
  constructor(message, data) {
    super(
      errorValues.internal.code,
      message || errorValues.internal.message,
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
      code, message || SERVER_ERROR_MESSAGE, data
    )
  }
}

const SERVER_ERROR_MESSAGE = 'Unspecified server error.'

const jsonRpcErrorCodes = [-32700, -32600, -32601, -32602, -32603]

const errorValues = {
  parse: {
    code: -32700,
    message: 'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.',
  },
  invalidRequest: {
    code: -32600,
    message: 'The JSON sent is not a valid Request object.',
  },
  methodNotFound: {
    code: -32601,
    message: 'The method does not exist / is not available.',
  },
  invalidParams: {
    code: -32602,
    message: 'Invalid method parameter(s).',
  },
  internal: {
    code: -32603,
    message: 'Internal JSON-RPC error.',
  },
}

function isValidCode(code) {
  return (code >= -32099 && code <= -32000) || jsonRpcErrorCodes.includes(code)
}

function getMessageFromCode(code) {
  switch (code) {
    case -32700:
      return errorValues.parse.message
    case -32600:
      return errorValues.invalidRequest.message
    case -32601:
      return errorValues.methodNotFound.message
    case -32602:
      return errorValues.invalidParams.message
    case -32603:
      return errorValues.internal.message
    default:
      break
  }
  if (isValidCode(code)) return SERVER_ERROR_MESSAGE
  return null
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
  errorValues,
  jsonRpcErrorCodes,
  isValidCode,
  getMessageFromCode,
  SERVER_ERROR_MESSAGE,
}
