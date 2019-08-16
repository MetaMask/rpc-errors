# eth-json-rpc-errors

Errors for [JSON RPC 2.0](https://www.jsonrpc.org/specification) and [ETH JSON RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC).

**Warning:** In beta. Wait for `1.0.0` release before using in production.

## Supported Errors

- All [JSON RPC 2.0](https://www.jsonrpc.org/specification) errors (see *"5.1 Error object"*)
- ETH JSON RPC
  - Proposed errors in [EIP 1193](https://eips.ethereum.org/EIPS/eip-1193) (see *"Error object and codes"*)
    - Does **not** yet support [`CloseEvent` errors or status codes](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes).

## Usage

Installation: `npm install eth-json-rpc-errors`

Import using ES6 syntax (no default) or Node `require`.

### Errors API

```js
import { rpcErrors } from 'eth-json-rpc-errors'

// standard JSON RPC 2.0 errors namespaced directly under rpcErrors
response.error = rpcErrors.methodNotFound(
  optionalCustomMessage, optionalData
)

// ETH JSON RPC errors namespaced under rpcErrors.eth
response.error = rpcErrors.eth.unauthorized(
  optionalCustomMessage, optionalData
)

// the message can be falsy or a string
// a falsy message will produce an error with a default message
response.error = rpcErrors.eth.unauthorized(null, optionalData)

// omitting the data argument will produce an error without a
// "data" property
response.error = rpcErrors.eth.unauthorized(optionalCustomMessage)

// both arguments can be omitted for almost all errors
response.error = rpcErrors.eth.unauthorized()
response.error = rpcErrors.methodNotFound()

// the JSON RPC 2.0 server error requires a valid code
response.error = rpcErrors.server(
  -32031, optionalCustomMessage, optionalData
)

// there's an option for nonStandard ETH errors
// it requires a valid code and a string message
// valid codes are integers i such that: 1000 <= i <= 4999
response.error = rpcErrors.eth.nonStandard(
  1001, requiredMessage, optionalData
)
```

### Other Exports
```js
/**
 * TypeScript interfaces
 */
import {
  IRpcErrors, IJsonRpcError, IEthJsonRpcError, ISerializeError
} from 'eth-json-rpc-errors'

/**
 * Classes
 */
import { JsonRpcError, EthJsonRpcError } from 'eth-json-rpc-errors'

/**
 * serializeError
 */
// this is useful for ensuring your errors are standardized
import { serializeError } from 'eth-json-rpc-errors'

// if the argument is not a valid error per any supported spec,
// it will be added as error.data.originalError
response.error = serializeError(maybeAnError)

// you can add a custom fallback error code and message if the 
const fallbackError = { code: 4999, message: 'My custom error.' }
response.error = serializeError(maybeAnError, fallbackError)

// the default fallback is:
{
  code: -32603,
  message: 'Internal JSON-RPC error.'
}

/**
 * getMessageFromCode & ERROR_CODES
 */
// get the default message, or null if it does not exist, for the
// given code
import { getMessageFromCode, ERROR_CODES } from 'eth-json-rpc-errors'
const message = getMessageFromCode(someCode) // string | null

// {
//   jsonRpc: { [errorName]: code, ... },
//   eth: { [errorName]: code, ... },
// }
const code1 = ERROR_CODES.jsonRpc.parse
const code2 = ERROR_CODES.eth.rejectedByUser

// all codes in ERROR_CODES have default messages
const message1 = getMessageFromCode(code1)
const message2 = getMessageFromCode(code2)
```

## License

MIT
