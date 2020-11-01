import { EthereumRpcError, EthereumProviderError } from './classes';
import { getMessageFromCode } from './utils';
import { errorCodes } from './error-constants';

interface EthereumErrorOptions {
  message?: string;
  data?: unknown;
}

interface ServerErrorOptions extends EthereumErrorOptions {
  code: number;
}

type CustomErrorOptions = ServerErrorOptions;

type EthErrorsArg = EthereumErrorOptions | string;

export const ethErrors = {
  rpc: {

    /**
     * Get a JSON RPC 2.0 Parse (-32700) error.
     */
    parse: (arg: EthErrorsArg) => getEthJsonRpcError(
      errorCodes.rpc.parse, arg,
    ),

    /**
     * Get a JSON RPC 2.0 Invalid Request (-32600) error.
     */
    invalidRequest: (arg: EthErrorsArg) => getEthJsonRpcError(
      errorCodes.rpc.invalidRequest, arg,
    ),

    /**
     * Get a JSON RPC 2.0 Invalid Params (-32602) error.
     */
    invalidParams: (arg: EthErrorsArg) => getEthJsonRpcError(
      errorCodes.rpc.invalidParams, arg,
    ),

    /**
     * Get a JSON RPC 2.0 Method Not Found (-32601) error.
     */
    methodNotFound: (arg: EthErrorsArg) => getEthJsonRpcError(
      errorCodes.rpc.methodNotFound, arg,
    ),

    /**
     * Get a JSON RPC 2.0 Internal (-32603) error.
     */
    internal: (arg: EthErrorsArg) => getEthJsonRpcError(
      errorCodes.rpc.internal, arg,
    ),

    /**
     * Get a JSON RPC 2.0 Server error.
     * Permits integer error codes in the [ -32099 <= -32005 ] range.
     * Codes -32000 through -32004 are reserved by EIP-1474.
     */
    server: (opts: ServerErrorOptions) => {
      if (!opts || typeof opts !== 'object' || Array.isArray(opts)) {
        throw new Error('Ethereum RPC Server errors must provide single object argument.');
      }
      const { code } = opts;
      if (!Number.isInteger(code) || code > -32005 || code < -32099) {
        throw new Error(
          '"code" must be an integer such that: -32099 <= code <= -32005',
        );
      }
      return getEthJsonRpcError(code, opts);
    },

    /**
     * Get an Ethereum JSON RPC Invalid Input (-32000) error.
     */
    invalidInput: (arg: EthErrorsArg) => getEthJsonRpcError(
      errorCodes.rpc.invalidInput, arg,
    ),

    /**
     * Get an Ethereum JSON RPC Resource Not Found (-32001) error.
     */
    resourceNotFound: (arg: EthErrorsArg) => getEthJsonRpcError(
      errorCodes.rpc.resourceNotFound, arg,
    ),

    /**
     * Get an Ethereum JSON RPC Resource Unavailable (-32002) error.
     */
    resourceUnavailable: (arg: EthErrorsArg) => getEthJsonRpcError(
      errorCodes.rpc.resourceUnavailable, arg,
    ),

    /**
     * Get an Ethereum JSON RPC Transaction Rejected (-32003) error.
     */
    transactionRejected: (arg: EthErrorsArg) => getEthJsonRpcError(
      errorCodes.rpc.transactionRejected, arg,
    ),

    /**
     * Get an Ethereum JSON RPC Method Not Supported (-32004) error.
     */
    methodNotSupported: (arg: EthErrorsArg) => getEthJsonRpcError(
      errorCodes.rpc.methodNotSupported, arg,
    ),

    /**
     * Get an Ethereum JSON RPC Limit Exceeded (-32005) error.
     */
    limitExceeded: (arg: EthErrorsArg) => getEthJsonRpcError(
      errorCodes.rpc.limitExceeded, arg,
    ),
  },

  provider: {

    /**
     * Get an Ethereum Provider User Rejected Request (4001) error.
     */
    userRejectedRequest: (arg: EthErrorsArg) => {
      return getEthProviderError(
        errorCodes.provider.userRejectedRequest, arg,
      );
    },

    /**
     * Get an Ethereum Provider Unauthorized (4100) error.
     */
    unauthorized: (arg: EthErrorsArg) => {
      return getEthProviderError(
        errorCodes.provider.unauthorized, arg,
      );
    },

    /**
     * Get an Ethereum Provider Unsupported Method (4200) error.
     */
    unsupportedMethod: (arg: EthErrorsArg) => {
      return getEthProviderError(
        errorCodes.provider.unsupportedMethod, arg,
      );
    },

    /**
     * Get an Ethereum Provider Not Connected (4900) error.
     */
    disconnected: (arg: EthErrorsArg) => {
      return getEthProviderError(
        errorCodes.provider.disconnected, arg,
      );
    },

    /**
     * Get an Ethereum Provider Chain Not Connected (4901) error.
     */
    chainDisconnected: (arg: EthErrorsArg) => {
      return getEthProviderError(
        errorCodes.provider.chainDisconnected, arg,
      );
    },

    /**
     * Get a custom Ethereum Provider error.
     */
    custom: (opts: CustomErrorOptions) => {
      if (!opts || typeof opts !== 'object' || Array.isArray(opts)) {
        throw new Error('Ethereum Provider custom errors must provide single object argument.');
      }
      const { code, message, data } = opts;
      if (!message || typeof message !== 'string') {
        throw new Error(
          '"message" must be a nonempty string',
        );
      }
      return new EthereumProviderError(code, message, data);
    },
  },
};

// Internal

function getEthJsonRpcError(code: number, arg: EthErrorsArg): EthereumRpcError {
  const [message, data] = validateOpts(arg);
  return new EthereumRpcError(
    code,
    message || getMessageFromCode(code),
    data,
  );
}

function getEthProviderError(code: number, arg: EthErrorsArg): EthereumProviderError {
  const [message, data] = validateOpts(arg);
  return new EthereumProviderError(
    code,
    message || getMessageFromCode(code),
    data,
  );
}

function validateOpts(arg: EthErrorsArg): [] | [string] | [string, unknown?] {
  if (arg) {
    if (typeof arg === 'string') {
      return [arg];
    } else if (typeof arg === 'object' && !Array.isArray(arg)) {
      const { message, data } = arg;
      if (typeof message !== 'string') {
        throw new Error('Must specify string message.');
      }
      return [message as string, data];
    }
  }
  return [];
}
