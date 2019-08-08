
export interface IJsonRpcError<T> {
  code: number; // must be an integer
  message: string;
  data?: T;
  stack?: any; // non-standard but not forbidden, and useful if it exists
}

export interface IEthJsonRpcError<T> extends IJsonRpcError<T> {}

export interface ISerializeError {
  (error: any, defaultMessage?: string | null, defaultCode?: number | null): IJsonRpcError<any>
}

export interface IRpcErrors {
  parse: (message?: string | null, data?: any) => IJsonRpcError<any>,
  invalidRequest: (message?: string | null, data?: any) => IJsonRpcError<any>,
  invalidParams: (message?: string | null, data?: any) => IJsonRpcError<any>,
  methodNotFound: (message?: string | null, data?: any) => IJsonRpcError<any>,
  internal: (message?: string | null, data?: any) => IJsonRpcError<any>,
  server: (code: number, message?: string | null, data?: any) => IJsonRpcError<any>,
  eth: {
    deniedRequestAccounts: (message?: string | null, data?: any) => IEthJsonRpcError<any>,
    deniedCreateAccount: (message?: string | null, data?: any) => IEthJsonRpcError<any>,
    unauthorized: (message?: string | null, data?: any) => IEthJsonRpcError<any>,
    unsupportedMethod: (message?: string | null, data?: any) => IEthJsonRpcError<any>,
    nonStandard: (code: number, message: string | null, data?: any) => IEthJsonRpcError<any>,
  }
}

// maybe export these some day

// export interface IGetMessageFromCode {
//   (error: any, defaultMessage?: string): string
// }

// export interface IIsValidCode {
//   (number: code): boolean
// }
