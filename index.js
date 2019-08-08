
const jsonRpc = require('./src/JsonRpcError')
const ethJsonRpc = require('./src/ethJsonRpcError')
const { serializeError } = require('./src/utils')
const errorValues = require('./src/errorValues.json')

module.exports = {
  JsonRpcError: jsonRpc.JsonRpcError,
  EthJsonRpcError: ethJsonRpc.EthJsonRpcError,
  serializeError,
  ERROR_VALUES: errorValues,
}
module.exports.rpcErrors = jsonRpc.errors
module.exports.rpcErrors.eth = ethJsonRpc.errors
