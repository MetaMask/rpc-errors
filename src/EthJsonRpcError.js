
const JsonRpcError = require('./JsonRpcError').JsonRpcError

class EthJsonRpcError extends JsonRpcError {
  constructor(code, message, data) {
    if (!isValidCode(code)) {
      throw new Error(
        '"code" must be an integer such that: 1000 <= code <= 4999'
      )
    }
    super(code, message, data)
  }
}

class DeniedRequestAccountsError extends EthJsonRpcError {
  constructor(message, data) {
    super(
      errorValues.deniedRequestAccounts.code,
      message || errorValues.deniedRequestAccounts.message,
      data
    )
  }
}

class DeniedCreateAccountError extends EthJsonRpcError {
  constructor(message, data) {
    super(
      errorValues.deniedCreateAccount.code,
      message || errorValues.deniedCreateAccount.message,
      data
    )
  }
}

class UnauthorizedError extends EthJsonRpcError {
  constructor(message, data) {
    super(
      errorValues.unauthorized.code,
      message || errorValues.unauthorized.message,
      data
    )
  }
}

class UnsupportedMethodError extends EthJsonRpcError {
  constructor(message, data) {
    super(
      errorValues.unsupportedMethod.code,
      message || errorValues.unsupportedMethod.message,
      data
    )
  }
}

const errorValues = {
  deniedRequestAccounts: {
    code: 4001,
    message: 'User denied authorizing any accounts.',
  },
  deniedCreateAccount: {
    code: 4010,
    message: 'User denied creating a new account.',
  },
  unauthorized: {
    code: 4100,
    message: 'The requested account has not been authorized by the user.',
  },
  unsupportedMethod: {
    code: 4200,
    message: 'The requested method is not supported by this Ethereum provider.',
  },
}

function isValidCode(code) {
  return Number.isInteger(code) && code >= 1000 && code <= 4999
}

function getMessageFromCode(code) {
  switch (code) {
    case 4001:
      return errorValues.deniedRequestAccounts.message
    case 4010:
      return errorValues.deniedCreateAccount.message
    case 4100:
      return errorValues.unauthorized.message
    case 4200:
      return errorValues.unsupportedMethod.message
    default:
      return null
  }
}

module.exports = {
  errors: {
    deniedRequestAccounts: (message, data) => {
      return new DeniedRequestAccountsError(message, data)
    },
    deniedCreateAccount: (message, data) => {
      return new DeniedCreateAccountError(message, data)
    },
    unauthorized: (message, data) => {
      return new UnauthorizedError(message, data)
    },
    unsupportedMethod: (message, data) => {
      return new UnsupportedMethodError(message, data)
    },
  },
  EthJsonRpcError,
  errorValues,
  isValidCode,
  getMessageFromCode,
}
