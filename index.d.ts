
export interface JsonRpcError<T> {
  code: number; // must be an integer
  message: string;
  data?: T;
  stack?: any; // non-standard but not forbidden, and useful if it exists
}
