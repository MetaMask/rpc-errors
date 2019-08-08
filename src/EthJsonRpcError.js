
const JsonRpcError = require('./JsonRpcError').JsonRpcError

const getMessageFromCode = require('./utils').getMessageFromCode

const CODES = require('./errorCodes.json').eth

function _isValidCode(code) {
  return Number.isInteger(code) && code >= 1000 && code <= 4999
}


class EthJsonRpcError extends JsonRpcError {
  constructor(code, message, data) {
    if (!_isValidCode(code)) {
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
      CODES.deniedRequestAccounts,
      message || getMessageFromCode(CODES.deniedRequestAccounts),
      data
    )
  }
}

class DeniedCreateAccountError extends EthJsonRpcError {
  constructor(message, data) {
    super(
      CODES.deniedCreateAccount,
      message || getMessageFromCode(CODES.deniedCreateAccount),
      data
    )
  }
}

class UnauthorizedError extends EthJsonRpcError {
  constructor(message, data) {
    super(
      CODES.unauthorized,
      message || getMessageFromCode(CODES.unauthorized),
      data
    )
  }
}

class UnsupportedMethodError extends EthJsonRpcError {
  constructor(message, data) {
    super(
      CODES.unsupportedMethod,
      message || getMessageFromCode(CODES.unsupportedMethod),
      data
    )
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
    nonStandard: (code, message, data) => {
      return new EthJsonRpcError(code, message, data)
    },
  },
  EthJsonRpcError,
}
