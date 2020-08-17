
export interface EthereumRpcError<T> {
  code: number; // must be an integer
  message: string;
  data?: T;
  stack?: any; // non-standard but not forbidden, and useful if it exists
}

export interface EthereumProviderError<T> extends EthereumRpcError<T> {}

type DefaultError = { code: number, message: string }

export interface ErrorOptions {
  message?: string | null,
  data?: any,
}

export type ErrorArg = ErrorOptions | string;

export interface RpcServerErrorOptions extends ErrorOptions {
  code: number,
}

export interface ProviderCustomErrorOptions extends ErrorOptions {
  code: number,
  message: string,
}

interface SerializeErrorOptions {
  fallbackError?: object,
  shouldIncludeStack?: boolean,
}

export interface SerializeError {
  (error: any, options?: SerializeErrorOptions): EthereumRpcError<any>
}

export interface GetMessageFromCode {
  (error: any, fallbackMessage?: string): string
}

export interface EthErrors {
  rpc: {
    invalidInput: (opts?: ErrorArg) => EthereumRpcError<any>,
    resourceNotFound: (opts?: ErrorArg) => EthereumRpcError<any>,
    resourceUnavailable: (opts?: ErrorArg) => EthereumRpcError<any>,
    transactionRejected: (opts?: ErrorArg) => EthereumRpcError<any>,
    methodNotSupported: (opts?: ErrorArg) => EthereumRpcError<any>,
    limitExceeded: (opts?: ErrorArg) => EthereumRpcError<any>,
    parse: (opts?: ErrorArg) => EthereumRpcError<any>,
    invalidRequest: (opts?: ErrorArg) => EthereumRpcError<any>,
    invalidParams: (opts?: ErrorArg) => EthereumRpcError<any>,
    methodNotFound: (opts?: ErrorArg) => EthereumRpcError<any>,
    internal: (opts?: ErrorArg) => EthereumRpcError<any>,
    server: (opts: RpcServerErrorOptions) => EthereumRpcError<any>,
  },
  provider: {
    userRejectedRequest: (opts?: ErrorArg) => EthereumProviderError<any>,
    unauthorized: (opts?: ErrorArg) => EthereumProviderError<any>,
    unsupportedMethod: (opts?: ErrorArg) => EthereumProviderError<any>,
    disconnected: (opts?: ErrorArg) => EthereumProviderError<any>,
    chainDisconnected: (opts?: ErrorArg) => EthereumProviderError<any>,
    custom: (opts: ProviderCustomErrorOptions) => EthereumProviderError<any>,
  }
}
