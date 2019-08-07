# eth-json-rpc-errors

Errors for [JSON RPC 2.0](https://www.jsonrpc.org/specification) and [ETH JSON RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC).

**Warning:** In beta. Wait for `1.0.0` release before using in production.

## Supported Errors

- All [JSON RPC 2.0](https://www.jsonrpc.org/specification) errors (see *"5.1 Error object"*)
- ETH JSON RPC
  - Proposed errors in [EIP 1193](https://eips.ethereum.org/EIPS/eip-1193) (see *"Error object and codes"*)
    - Does not yet support [`CloseEvent` errors or status codes](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes).

## Usage

Installation: `npm install eth-json-rpc-errors`

Import using ES6 syntax (no default) or Node `require`.

### Errors API

```js
import { errors } from 'eth-json-rpc-errors'

// standard JSON RPC 2.0 errors namespaced directly under errors
response.error = errors.methodNotFound(someMessage, someUsefulData)

// ETH JSON RPC errors namespaced under errors.eth
response.error = errors.eth.deniedRequestAccounts(someMessage, someUsefulData)

// the message can be falsy or a string
// a falsy message will produce an error with a default message
response.error = errors.eth.deniedRequestAccounts(null, someUsefulData)

// omitting the second argument will produce an error without a "data" property
response.error = errors.eth.deniedRequestAccounts()
```

### Other Exports
```js
// TypeScript interfaces
import { IRpcErrors, IJsonRpcError, IEthJsonRpcError } from 'eth-json-rpc-errors'

// classes
const JsonRpcError = require('eth-json-rpc-errors').JsonRpcError
const EthJsonRpcError = require('eth-json-rpc-errors').EthJsonRpcError

// serializeError
// this is useful for ensuring your errors are standardized
const serializeError = require('eth-json-rpc-errors').serializeError
// if the argument is not a valid error per any supported spec, it will be
// added as error.data.originalError
response.error = serializeError(anything)
```

## License
MIT
