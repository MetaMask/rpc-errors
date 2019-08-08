
const jsonRpc = require('./src/JsonRpcError')
const ethJsonRpc = require('./src/ethJsonRpcError')
const { getMessageFromCode, isValidCode } = require('./src/utils')
const errorValues = require('./src/errorValues.json')

module.exports = {
  JsonRpcError: jsonRpc.JsonRpcError,
  EthJsonRpcError: ethJsonRpc.EthJsonRpcError,
  serializeError,
  ERROR_VALUES: errorValues,
}
module.exports.rpcErrors = jsonRpc.errors
module.exports.rpcErrors.eth = ethJsonRpc.errors

/**
 * Serializes the given error to a ETH JSON RPC-compatible error object.
 * Merely copies the given error's values if it is already compatible.
 * If the given error is not fully compatible, it will be preserved on the
 * returned object's data.originalError property.
 * Non-standard: adds a 'stack' property if it exists on the given error.
 *
 * @param  {object} error the error to serialize
 * @param  {string} defaultMessage optional default message if error has no message
 */
function serializeError (error, defaultMessage, defaultCode) {

  const serialized = {}

  if (isValidCode(error.code)) {

    serialized.code = error.code

    if (typeof error.message === 'string') {
      serialized.message = error.message
      if (error.hasOwnProperty('data')) serialized.data = error.data
    } else {
      serialized.message = getMessageFromCode(serialized.code)
      serialized.data = { originalError: assignOriginalError(error) }
    }

  } else {
    serialized.code = defaultCode || jsonRpc.CODES.internal
    serialized.message = (
      defaultMessage || getMessageFromCode(serialized.code)
    )
    serialized.data = { originalError: assignOriginalError(error) }
  }

  if (error.stack) serialized.stack = error.stack
  return serialized
}

function assignOriginalError (error) {
  if (typeof error === 'object' && !Array.isArray(error)) {
    return Object.assign({}, error)
  }
  return error
}
