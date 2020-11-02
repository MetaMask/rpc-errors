import { EthereumRpcError, EthereumProviderError } from './classes';
import { getMessageFromCode } from './utils';
import { errorCodes } from './error-constants';

interface EthereumErrorOptions<T> {
  message?: string;
  data?: T;
}

interface ServerErrorOptions<T> extends EthereumErrorOptions<T> {
  code: number;
}

type CustomErrorOptions<T> = ServerErrorOptions<T>;

type EthErrorsArg<T> = EthereumErrorOptions<T> | string;

export const ethErrors = {
  rpc: {

    /**
     * Get a JSON RPC 2.0 Parse (-32700) error.
     */
    parse: <T>(arg: EthErrorsArg<T>) => getEthJsonRpcError(
      errorCodes.rpc.parse, arg,
    ),

    /**
     * Get a JSON RPC 2.0 Invalid Request (-32600) error.
     */
    invalidRequest: <T>(arg: EthErrorsArg<T>) => getEthJsonRpcError(
      errorCodes.rpc.invalidRequest, arg,
    ),

    /**
     * Get a JSON RPC 2.0 Invalid Params (-32602) error.
     */
    invalidParams: <T>(arg: EthErrorsArg<T>) => getEthJsonRpcError(
      errorCodes.rpc.invalidParams, arg,
    ),

    /**
     * Get a JSON RPC 2.0 Method Not Found (-32601) error.
     */
    methodNotFound: <T>(arg: EthErrorsArg<T>) => getEthJsonRpcError(
      errorCodes.rpc.methodNotFound, arg,
    ),

    /**
     * Get a JSON RPC 2.0 Internal (-32603) error.
     */
    internal: <T>(arg: EthErrorsArg<T>) => getEthJsonRpcError(
      errorCodes.rpc.internal, arg,
    ),

    /**
     * Get a JSON RPC 2.0 Server error.
     * Permits integer error codes in the [ -32099 <= -32005 ] range.
     * Codes -32000 through -32004 are reserved by EIP-1474.
     */
    server: <T>(opts: ServerErrorOptions<T>) => {
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
    invalidInput: <T>(arg: EthErrorsArg<T>) => getEthJsonRpcError(
      errorCodes.rpc.invalidInput, arg,
    ),

    /**
     * Get an Ethereum JSON RPC Resource Not Found (-32001) error.
     */
    resourceNotFound: <T>(arg: EthErrorsArg<T>) => getEthJsonRpcError(
      errorCodes.rpc.resourceNotFound, arg,
    ),

    /**
     * Get an Ethereum JSON RPC Resource Unavailable (-32002) error.
     */
    resourceUnavailable: <T>(arg: EthErrorsArg<T>) => getEthJsonRpcError(
      errorCodes.rpc.resourceUnavailable, arg,
    ),

    /**
     * Get an Ethereum JSON RPC Transaction Rejected (-32003) error.
     */
    transactionRejected: <T>(arg: EthErrorsArg<T>) => getEthJsonRpcError(
      errorCodes.rpc.transactionRejected, arg,
    ),

    /**
     * Get an Ethereum JSON RPC Method Not Supported (-32004) error.
     */
    methodNotSupported: <T>(arg: EthErrorsArg<T>) => getEthJsonRpcError(
      errorCodes.rpc.methodNotSupported, arg,
    ),

    /**
     * Get an Ethereum JSON RPC Limit Exceeded (-32005) error.
     */
    limitExceeded: <T>(arg: EthErrorsArg<T>) => getEthJsonRpcError(
      errorCodes.rpc.limitExceeded, arg,
    ),
  },

  provider: {

    /**
     * Get an Ethereum Provider User Rejected Request (4001) error.
     */
    userRejectedRequest: <T>(arg: EthErrorsArg<T>) => {
      return getEthProviderError(
        errorCodes.provider.userRejectedRequest, arg,
      );
    },

    /**
     * Get an Ethereum Provider Unauthorized (4100) error.
     */
    unauthorized: <T>(arg: EthErrorsArg<T>) => {
      return getEthProviderError(
        errorCodes.provider.unauthorized, arg,
      );
    },

    /**
     * Get an Ethereum Provider Unsupported Method (4200) error.
     */
    unsupportedMethod: <T>(arg: EthErrorsArg<T>) => {
      return getEthProviderError(
        errorCodes.provider.unsupportedMethod, arg,
      );
    },

    /**
     * Get an Ethereum Provider Not Connected (4900) error.
     */
    disconnected: <T>(arg: EthErrorsArg<T>) => {
      return getEthProviderError(
        errorCodes.provider.disconnected, arg,
      );
    },

    /**
     * Get an Ethereum Provider Chain Not Connected (4901) error.
     */
    chainDisconnected: <T>(arg: EthErrorsArg<T>) => {
      return getEthProviderError(
        errorCodes.provider.chainDisconnected, arg,
      );
    },

    /**
     * Get a custom Ethereum Provider error.
     */
    custom: <T>(opts: CustomErrorOptions<T>) => {
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

function getEthJsonRpcError<T>(code: number, arg: EthErrorsArg<T>): EthereumRpcError<T> {
  const [message, data] = parseOpts(arg);
  return new EthereumRpcError(
    code,
    message || getMessageFromCode(code),
    data,
  );
}

function getEthProviderError<T>(code: number, arg: EthErrorsArg<T>): EthereumProviderError<T> {
  const [message, data] = parseOpts(arg);
  return new EthereumProviderError(
    code,
    message || getMessageFromCode(code),
    data,
  );
}

function parseOpts<T>(arg: EthErrorsArg<T>): [string?, T?] {
  if (arg) {
    if (typeof arg === 'string') {
      return [arg];
    } else if (typeof arg === 'object' && !Array.isArray(arg)) {
      const { message, data } = arg;

      if (message && typeof message !== 'string') {
        throw new Error('Must specify string message.');
      }
      return [message || undefined, data];
    }
  }
  return [];
}
