
const { EthereumRpcError, EthereumProviderError } = require('./classes')
const { getMessageFromCode } = require('./utils')
const ERROR_CODES = require('./errorCodes.json')

module.exports = {
  rpc: {
    /**
     * Get a JSON RPC 2.0 Parse error.
     * 
     * @param {string} [message] - A custom message.
     * @param {any} [data] - Error data.
     * @return {EthereumRpcError} The error.
     */
    parse: (opts) => getEthJsonRpcError(
      ERROR_CODES.rpc.parse, opts
    ),

    /**
     * Get a JSON RPC 2.0 Invalid Request error.
     * 
     * @param {string} [message] - A custom message.
     * @param {any} [data] - Error data.
     * @return {EthereumRpcError} The error.
     */
    invalidRequest: (opts) => getEthJsonRpcError(
      ERROR_CODES.rpc.invalidRequest, opts
    ),

    /**
     * Get a JSON RPC 2.0 Invalid Params error.
     * 
     * @param {string} [message] - A custom message.
     * @param {any} [data] - Error data.
     * @return {EthereumRpcError} The error.
     */
    invalidParams: (opts) => getEthJsonRpcError(
      ERROR_CODES.rpc.invalidParams, opts
    ),

    /**
     * Get a JSON RPC 2.0 Method Not Found error.
     * 
     * @param {string} [message] - A custom message.
     * @param {any} [data] - Error data.
     * @return {EthereumRpcError} The error.
     */
    methodNotFound: (opts) => getEthJsonRpcError(
      ERROR_CODES.rpc.methodNotFound, opts
    ),

    /**
     * Get a JSON RPC 2.0 Internal error.
     * 
     * @param {string} [message] - A custom message.
     * @param {any} [data] - Error data.
     * @return {EthereumRpcError} The error.
     */
    internal: (opts) => getEthJsonRpcError(
      ERROR_CODES.rpc.internal, opts
    ),

    /**
     * Get a JSON RPC 2.0 Server error.
     * Permits integer error codes in the [ -32099 <= -32005 ] range.
     * Codes -32000 through -32004 are reserved by EIP 1474.
     * 
     * @param {number} [code] - The integer error code.
     * @param {string} [message] - A custom message.
     * @param {any} [data] - Error data.
     * @return {EthereumRpcError} The error.
     */
    server: (opts) => {
      if (typeof opts !== 'object' || Array.isArray(opts)) {
        throw new Error('Ethereum RPC Server errors must provide single object argument.')
      }
      const { code } = opts
      if (!Number.isInteger(code) || code > -32005 || code < -32099) {
        throw new Error(
          '"code" must be an integer such that: -32099 <= code <= -32005'
        )
      }
      return getEthJsonRpcError(code, opts)
    },

    /**
     * Get an Ethereum JSON RPC Invalid Input error.
     * 
     * @param {string} [message] - A custom message.
     * @param {any} [data] - Error data.
     * @return {EthereumRpcError} The error.
     */
    invalidInput: (opts) => getEthJsonRpcError(
      ERROR_CODES.rpc.invalidInput, opts
    ),

    /**
     * Get an Ethereum JSON RPC Resource Not Found error.
     * 
     * @param {string} [message] - A custom message.
     * @param {any} [data] - Error data.
     * @return {EthereumRpcError} The error.
     */
    resourceNotFound: (opts) => getEthJsonRpcError(
      ERROR_CODES.rpc.resourceNotFound, opts
    ),

    /**
     * Get an Ethereum JSON RPC Resource Unavailable error.
     * 
     * @param {string} [message] - A custom message.
     * @param {any} [data] - Error data.
     * @return {EthereumRpcError} The error.
     */
    resourceUnavailable: (opts) => getEthJsonRpcError(
      ERROR_CODES.rpc.resourceUnavailable, opts
    ),

    /**
     * Get an Ethereum JSON RPC Transaction Rejected error.
     * 
     * @param {string} [message] - A custom message.
     * @param {any} [data] - Error data.
     * @return {EthereumRpcError} The error.
     */
    transactionRejected: (opts) => getEthJsonRpcError(
      ERROR_CODES.rpc.transactionRejected, opts
    ),

    /**
     * Get an Ethereum JSON RPC Method Not Supported error.
     * 
     * @param {string} [message] - A custom message.
     * @param {any} [data] - Error data.
     * @return {EthereumRpcError} The error.
     */
    methodNotSupported: (opts) => getEthJsonRpcError(
      ERROR_CODES.rpc.methodNotSupported, opts
    ),
  },

  provider: {
    /**
     * Get an Ethereum Provider User Rejected Request error.
     * 
     * @param {string} [message] - A custom message.
     * @param {any} [data] - Error data.
     * @return {EthereumProviderError} The error.
     */
    userRejectedRequest: (opts) => {
      return getEthProviderError(
        ERROR_CODES.provider.userRejectedRequest, opts
      )
    },

    /**
     * Get an Ethereum Provider Unauthorized error.
     * 
     * @param {string} [message] - A custom message.
     * @param {any} [data] - Error data.
     * @return {EthereumProviderError} The error.
     */
    unauthorized: (opts) => {
      return getEthProviderError(
        ERROR_CODES.provider.unauthorized, opts
      )
    },

    /**
     * Get an Ethereum Provider Unsupported Method error.
     * 
     * @param {string} [message] - A custom message.
     * @param {any} [data] - Error data.
     * @return {EthereumProviderError} The error.
     */
    unsupportedMethod: (opts) => {
      return getEthProviderError(
        ERROR_CODES.provider.unsupportedMethod, opts
      )
    },

    /**
     * Get a custom Ethereum provider error.
     * 
     * @param {string} [code] - The error code.
     * @param {string} [message] - The error message.
     * @param {any} [data] - Error data.
     * @return {EthereumProviderError} The error.
     */
    custom: (opts) => {
      if (typeof opts !== 'object' || Array.isArray(opts)) {
        throw new Error('Ethereum Provider custom errors must provide single object argument.')
      }
      const { code, message, data } = opts
      if (!message || typeof message !== 'string') throw new Error(
        '"message" must be a nonempty string'
      )
      return new EthereumProviderError(code, message, data)
    },
  },
}

// Internal

function getEthJsonRpcError(code, opts) {
  const [ message, data ] = validateOpts(opts)
  return new EthereumRpcError(
    code,
    message || getMessageFromCode(code),
    data
  )
}

function getEthProviderError(code, opts) {
  const [ message, data ] = validateOpts(opts)
  return new EthereumProviderError(
    code,
    message || getMessageFromCode(code),
    data
  )
}

function validateOpts (opts) {
  let message, data
  if (opts) {
    if (typeof opts === 'string') {
      message = opts
    } else if (opts && typeof opts === 'object' && !Array.isArray(opts)) {
      message = opts.message
      data = opts.data
    }
  }
  return [ message, data ]
}
