
const jsonRpc = require('./src/JsonRpcError')
const ethJsonRpc = require('./src/ethJsonRpcError')
const {
  serializeError, getMessageFromCode
} = require('./src/utils')
const errorValues = require('./src/errorValues.json')
const errorCodes = require('./src/errorCodes.json')

module.exports = {
  JsonRpcError: jsonRpc.JsonRpcError,
  EthJsonRpcError: ethJsonRpc.EthJsonRpcError,
  serializeError,
  getMessageFromCode,
  ERROR_CODES: errorCodes,
}
module.exports.rpcErrors = jsonRpc.errors
module.exports.rpcErrors.eth = ethJsonRpc.errors
