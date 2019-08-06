
const JsonRpcError = require('./JsonRpcError').JsonRpcError

class EthJsonRpcError extends JsonRpcError {
  constructor(code, message, data) {
    if (!Number.isInteger(code) || code < 1000 || code > 4999) {
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
      ethJsonRpcErrorValues.deniedRequestAccounts.code,
      message || ethJsonRpcErrorValues.deniedRequestAccounts.message,
      data
    )
  }
}

class DeniedCreateAccountError extends EthJsonRpcError {
  constructor(message, data) {
    super(
      ethJsonRpcErrorValues.deniedCreateAccount.code,
      message || ethJsonRpcErrorValues.deniedCreateAccount.message,
      data
    )
  }
}

class UnauthorizedError extends EthJsonRpcError {
  constructor(message, data) {
    super(
      ethJsonRpcErrorValues.unauthorized.code,
      message || ethJsonRpcErrorValues.unauthorized.message,
      data
    )
  }
}

class UnsupportedMethodError extends EthJsonRpcError {
  constructor(message, data) {
    super(
      ethJsonRpcErrorValues.unsupportedMethod.code,
      message || ethJsonRpcErrorValues.unsupportedMethod.message,
      data
    )
  }
}

const ethJsonRpcErrorValues = {
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

module.exports = {
  default: {
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
  ethJsonRpcErrorValues,
}
