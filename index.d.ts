
export interface JsonRpcError<T> {
  code: number; // must be an integer
  message: string;
  data?: T;
  stack?: any; // non-standard but not forbidden, and useful if it exists
}

export interface EthJsonRpcError<T> extends JsonRpcError<T> {}

export interface rpcErrors {
  parse: (message?: string | null, data?: any) => JsonRpcError<any>,
  invalidRequest: (message?: string | null, data?: any) => JsonRpcError<any>,
  invalidParams: (message?: string | null, data?: any) => JsonRpcError<any>,
  methodNotFound: (message?: string | null, data?: any) => JsonRpcError<any>,
  internal: (message?: string | null, data?: any) => JsonRpcError<any>,
  server: (code: number, message?: string | null, data?: any) => JsonRpcError<any>,
  eth: {
    deniedRequestAccounts: (message?: string | null, data?: any) => EthJsonRpcError<any>,
    deniedCreateAccount: (message?: string | null, data?: any) => EthJsonRpcError<any>,
    unauthorized: (message?: string | null, data?: any) => EthJsonRpcError<any>,
    unsupportedMethod: (message?: string | null, data?: any) => EthJsonRpcError<any>,
    nonStandard: (code: number, message: string | null, data?: any) => EthJsonRpcError<any>,
  }
}
