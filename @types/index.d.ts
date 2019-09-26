
export interface IEthereumRpcError<T> {
  code: number; // must be an integer
  message: string;
  data?: T;
  stack?: any; // non-standard but not forbidden, and useful if it exists
}

export interface IEthereumProviderError<T> extends IEthereumRpcError<T> {}

type DefaultError = { code: number, message: string }

export interface ISerializeError {
  (error: any, fallbackError?: DefaultError): IEthereumRpcError<any>
}

export interface IGetMessageFromCode {
  (error: any, fallbackMessage?: string): string
}

export interface IRpcErrors {
  rpc: {
    invalidInput: (message?: string | null, data?: any) => IEthereumRpcError<any>,
    resourceNotFound: (message?: string | null, data?: any) => IEthereumRpcError<any>,
    resourceUnavailable: (message?: string | null, data?: any) => IEthereumRpcError<any>,
    transactionRejected: (message?: string | null, data?: any) => IEthereumRpcError<any>,
    methodNotSupported: (message?: string | null, data?: any) => IEthereumRpcError<any>,
    parse: (message?: string | null, data?: any) => IEthereumRpcError<any>,
    invalidRequest: (message?: string | null, data?: any) => IEthereumRpcError<any>,
    invalidParams: (message?: string | null, data?: any) => IEthereumRpcError<any>,
    methodNotFound: (message?: string | null, data?: any) => IEthereumRpcError<any>,
    internal: (message?: string | null, data?: any) => IEthereumRpcError<any>,
    server: (code: number, message?: string | null, data?: any) => IEthereumRpcError<any>,
  },
  provider: {
    userRejectedRequest: (message?: string | null, data?: any) => IEthereumProviderError<any>,
    unauthorized: (message?: string | null, data?: any) => IEthereumProviderError<any>,
    unsupportedMethod: (message?: string | null, data?: any) => IEthereumProviderError<any>,
    custom: (code: number, message: string | null, data?: any) => IEthereumProviderError<any>,
  }
}

// maybe export this once valid codes and messages can be extended at runtime

// export interface IIsValidCode {
//   (number: code): boolean
// }
