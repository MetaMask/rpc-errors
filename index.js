
const jsonRpc = require('./src/JsonRpcError')
const ethJsonRpc = require('./src/EthJsonRpcError')
const {
  serializeError, getMessageFromCode,
} = require('./src/utils')
const errorCodes = require('./src/errorCodes.json')

const rpcErrors = jsonRpc.errors
rpcErrors.eth = ethJsonRpc.errors

module.exports = {
  rpcErrors,
  JsonRpcError: jsonRpc.JsonRpcError,
  EthJsonRpcError: ethJsonRpc.EthJsonRpcError,
  serializeError,
  getMessageFromCode,
  ERROR_CODES: errorCodes,
}
