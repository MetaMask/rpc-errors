
const jsonRpcExports = require('./src/JsonRpcError')
const ethJsonRpcExports = require('./src/EthJsonRpcError')

module.exports = {
  default: {
    ...jsonRpcExports.default,
    eth: ethJsonRpcExports.default,
  },
  JsonRpcError: jsonRpcExports.JsonRpcError,
  EthJsonRpcError: ethJsonRpcExports.EthJsonRpcError,
  JSON_RPC_ERROR_VALUES: jsonRpcExports.jsonRpcErrorValues,
  ETH_JSON_RPC_ERROR_VALUES: ethJsonRpcExports.ethJsonRpcErrorValues,
}
