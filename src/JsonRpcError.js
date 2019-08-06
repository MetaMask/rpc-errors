
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
    return serialized
  }
}

class ParseError extends JsonRpcError {
  constructor(message, data) {
    super(
      jsonRpcErrorValues.parse.code,
      message || jsonRpcErrorValues.parse.message,
      data
    )
  }
}

class InvalidRequestError extends JsonRpcError {
  constructor(message, data) {
    super(
      jsonRpcErrorValues.invalidRequest.code,
      message || jsonRpcErrorValues.invalidRequest.message,
      data
    )
  }
}

class MethodNotFoundError extends JsonRpcError {
  constructor(message, data) {
    super(
      jsonRpcErrorValues.methodNotFound.code,
      message || jsonRpcErrorValues.methodNotFound.message,
      data
    )
  }
}

class InvalidParamsError extends JsonRpcError {
  constructor(message, data) {
    super(
      jsonRpcErrorValues.invalidParams.code,
      message || jsonRpcErrorValues.invalidParams.message,
      data
    )
  }
}

class InternalError extends JsonRpcError {
  constructor(message, data) {
    super(
      jsonRpcErrorValues.internal.code,
      message || jsonRpcErrorValues.internal.message,
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
      code, message || 'Unspecified server error.', data
    )
  }
}

const jsonRpcErrorValues = {
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

module.exports = {
  default: {
    parse: (message, data) => new ParseError(message, data),
    invalidRequest: (message, data) => new InvalidRequestError(message, data),
    invalidParams: (message, data) => new InvalidParamsError(message, data),
    methodNotFound: (message, data) => new MethodNotFoundError(message, data),
    internal: (message, data) => new InternalError(message, data),
    server: (code, message, data) => new ServerError(code, message, data),
  },
  JsonRpcError,
  jsonRpcErrorValues,
}
