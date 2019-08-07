
const jsonRpc = require('./src/JsonRpcError')
const ethJsonRpc = require('./src/ethJsonRpcError')

module.exports = {
  JsonRpcError: jsonRpc.JsonRpcError,
  EthJsonRpcError: ethJsonRpc.EthJsonRpcError,
  JSON_RPC_ERROR_VALUES: jsonRpc.errorValues,
  ETH_JSON_RPC_ERROR_VALUES: ethJsonRpc.errorValues,
  serializeError,
  getMessageFromCode,
}
module.exports.errors = jsonRpc.errors
module.exports.errors.eth = ethJsonRpc.errors

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
function serializeError (error, defaultMessage) {

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
    serialized.code = jsonRpc.errorValues.internal.code
    serialized.message = defaultMessage || jsonRpc.errorValues.internal.message
    serialized.data = { originalError: assignOriginalError(error) }
  }

  if (error.stack) serialized.stack = error.stack
  return serialized
}

function isValidCode (code) {
  return (
    Number.isInteger(code) &&
    (jsonRpc.isValidCode(code) || ethJsonRpc.isValidCode(code))
  )
}

function getMessageFromCode (code) {
  return jsonRpc.getMessageFromCode(code) || ethJsonRpc.getMessageFromCode(code)
}

function assignOriginalError (error) {
  if (typeof error === 'object' && !Array.isArray(error)) {
    return Object.assign({}, error)
  }
  return error
}
