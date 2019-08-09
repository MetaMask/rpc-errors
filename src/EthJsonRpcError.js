
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

function getError(code, message, data) {
  return new EthJsonRpcError(
    code,
    message || getMessageFromCode(code),
    data
  )
}


module.exports = {
  errors: {
    deniedRequestAccounts: (message, data) => {
      return getError(CODES.deniedRequestAccounts, message, data)
    },
    deniedCreateAccount: (message, data) => {
      return getError(CODES.deniedCreateAccount, message, data)
    },
    unauthorized: (message, data) => {
      return getError(CODES.unauthorized, message, data)
    },
    unsupportedMethod: (message, data) => {
      return getError(CODES.unsupportedMethod, message, data)
    },
    nonStandard: (code, message, data) => {
      return new EthJsonRpcError(code, message, data)
    },
  },
  EthJsonRpcError,
}
