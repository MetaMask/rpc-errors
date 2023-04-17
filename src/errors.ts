import { JsonRpcError, EthereumProviderError } from './classes';
import { DataWithOptionalCause, getMessageFromCode } from './utils';
import { errorCodes } from './error-constants';

type EthereumErrorOptions<T extends DataWithOptionalCause> = {
  message?: string;
  data?: T;
};

type ServerErrorOptions<T extends DataWithOptionalCause> = {
  code: number;
} & EthereumErrorOptions<T>;

type CustomErrorArg<T extends DataWithOptionalCause> = ServerErrorOptions<T>;

type JsonRpcErrorsArg<T extends DataWithOptionalCause> =
  | EthereumErrorOptions<T>
  | string;

export const rpcErrors = {
  /**
   * Get a JSON RPC 2.0 Parse (-32700) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  parse: <T extends DataWithOptionalCause>(arg?: JsonRpcErrorsArg<T>) =>
    getJsonRpcError(errorCodes.rpc.parse, arg),

  /**
   * Get a JSON RPC 2.0 Invalid Request (-32600) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  invalidRequest: <T extends DataWithOptionalCause>(
    arg?: JsonRpcErrorsArg<T>,
  ) => getJsonRpcError(errorCodes.rpc.invalidRequest, arg),

  /**
   * Get a JSON RPC 2.0 Invalid Params (-32602) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  invalidParams: <T extends DataWithOptionalCause>(arg?: JsonRpcErrorsArg<T>) =>
    getJsonRpcError(errorCodes.rpc.invalidParams, arg),

  /**
   * Get a JSON RPC 2.0 Method Not Found (-32601) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  methodNotFound: <T extends DataWithOptionalCause>(
    arg?: JsonRpcErrorsArg<T>,
  ) => getJsonRpcError(errorCodes.rpc.methodNotFound, arg),

  /**
   * Get a JSON RPC 2.0 Internal (-32603) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  internal: <T extends DataWithOptionalCause>(arg?: JsonRpcErrorsArg<T>) =>
    getJsonRpcError(errorCodes.rpc.internal, arg),

  /**
   * Get a JSON RPC 2.0 Server error.
   * Permits integer error codes in the [ -32099 <= -32005 ] range.
   * Codes -32000 through -32004 are reserved by EIP-1474.
   *
   * @param opts - The error options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  server: <T extends DataWithOptionalCause>(opts: ServerErrorOptions<T>) => {
    if (!opts || typeof opts !== 'object' || Array.isArray(opts)) {
      throw new Error(
        'Ethereum RPC Server errors must provide single object argument.',
      );
    }
    const { code } = opts;
    if (!Number.isInteger(code) || code > -32005 || code < -32099) {
      throw new Error(
        '"code" must be an integer such that: -32099 <= code <= -32005',
      );
    }
    return getJsonRpcError(code, opts);
  },

  /**
   * Get an Ethereum JSON RPC Invalid Input (-32000) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  invalidInput: <T extends DataWithOptionalCause>(arg?: JsonRpcErrorsArg<T>) =>
    getJsonRpcError(errorCodes.rpc.invalidInput, arg),

  /**
   * Get an Ethereum JSON RPC Resource Not Found (-32001) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  resourceNotFound: <T extends DataWithOptionalCause>(
    arg?: JsonRpcErrorsArg<T>,
  ) => getJsonRpcError(errorCodes.rpc.resourceNotFound, arg),

  /**
   * Get an Ethereum JSON RPC Resource Unavailable (-32002) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  resourceUnavailable: <T extends DataWithOptionalCause>(
    arg?: JsonRpcErrorsArg<T>,
  ) => getJsonRpcError(errorCodes.rpc.resourceUnavailable, arg),

  /**
   * Get an Ethereum JSON RPC Transaction Rejected (-32003) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  transactionRejected: <T extends DataWithOptionalCause>(
    arg?: JsonRpcErrorsArg<T>,
  ) => getJsonRpcError(errorCodes.rpc.transactionRejected, arg),

  /**
   * Get an Ethereum JSON RPC Method Not Supported (-32004) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  methodNotSupported: <T extends DataWithOptionalCause>(
    arg?: JsonRpcErrorsArg<T>,
  ) => getJsonRpcError(errorCodes.rpc.methodNotSupported, arg),

  /**
   * Get an Ethereum JSON RPC Limit Exceeded (-32005) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  limitExceeded: <T extends DataWithOptionalCause>(arg?: JsonRpcErrorsArg<T>) =>
    getJsonRpcError(errorCodes.rpc.limitExceeded, arg),
};

export const providerErrors = {
  /**
   * Get an Ethereum Provider User Rejected Request (4001) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link EthereumProviderError} class.
   */
  userRejectedRequest: <T extends DataWithOptionalCause>(
    arg?: JsonRpcErrorsArg<T>,
  ) => {
    return getEthProviderError(errorCodes.provider.userRejectedRequest, arg);
  },

  /**
   * Get an Ethereum Provider Unauthorized (4100) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link EthereumProviderError} class.
   */
  unauthorized: <T extends DataWithOptionalCause>(
    arg?: JsonRpcErrorsArg<T>,
  ) => {
    return getEthProviderError(errorCodes.provider.unauthorized, arg);
  },

  /**
   * Get an Ethereum Provider Unsupported Method (4200) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link EthereumProviderError} class.
   */
  unsupportedMethod: <T extends DataWithOptionalCause>(
    arg?: JsonRpcErrorsArg<T>,
  ) => {
    return getEthProviderError(errorCodes.provider.unsupportedMethod, arg);
  },

  /**
   * Get an Ethereum Provider Not Connected (4900) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link EthereumProviderError} class.
   */
  disconnected: <T extends DataWithOptionalCause>(
    arg?: JsonRpcErrorsArg<T>,
  ) => {
    return getEthProviderError(errorCodes.provider.disconnected, arg);
  },

  /**
   * Get an Ethereum Provider Chain Not Connected (4901) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link EthereumProviderError} class.
   */
  chainDisconnected: <T extends DataWithOptionalCause>(
    arg?: JsonRpcErrorsArg<T>,
  ) => {
    return getEthProviderError(errorCodes.provider.chainDisconnected, arg);
  },

  /**
   * Get a custom Ethereum Provider error.
   *
   * @param opts - The error options bag.
   * @returns An instance of the {@link EthereumProviderError} class.
   */
  custom: <T extends DataWithOptionalCause>(opts: CustomErrorArg<T>) => {
    if (!opts || typeof opts !== 'object' || Array.isArray(opts)) {
      throw new Error(
        'Ethereum Provider custom errors must provide single object argument.',
      );
    }

    const { code, message, data } = opts;

    if (!message || typeof message !== 'string') {
      throw new Error('"message" must be a nonempty string');
    }
    return new EthereumProviderError(code, message, data);
  },
};

/**
 * Get a generic JSON-RPC error class instance.
 *
 * @param code - The error code.
 * @param arg - The error message or options bag.
 * @returns An instance of the {@link JsonRpcError} class.
 */
function getJsonRpcError<T extends DataWithOptionalCause>(
  code: number,
  arg?: JsonRpcErrorsArg<T>,
): JsonRpcError<T> {
  const [message, data] = parseOpts(arg);
  return new JsonRpcError(code, message || getMessageFromCode(code), data);
}

/**
 * Get an Ethereum Provider error class instance.
 *
 * @param code - The error code.
 * @param arg - The error message or options bag.
 * @returns An instance of the {@link EthereumProviderError} class.
 */
function getEthProviderError<T extends DataWithOptionalCause>(
  code: number,
  arg?: JsonRpcErrorsArg<T>,
): EthereumProviderError<T> {
  const [message, data] = parseOpts(arg);
  return new EthereumProviderError(
    code,
    message || getMessageFromCode(code),
    data,
  );
}

/**
 * Get an error message and optional data from an options bag.
 *
 * @param arg - The error message or options bag.
 * @returns A tuple containing the error message and optional data.
 */
function parseOpts<T extends DataWithOptionalCause>(
  arg?: JsonRpcErrorsArg<T>,
): [message?: string | undefined, data?: T | undefined] {
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
