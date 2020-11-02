import safeStringify from 'fast-safe-stringify';

export interface SerializedEthereumRpcError {
  code: number; // must be an integer
  message: string;
  data?: unknown;
  stack?: unknown;
}

/**
 * Error subclass implementing JSON RPC 2.0 errors and Ethereum RPC errors
 * per EIP-1474.
 * Permits any integer error code.
 */
export class EthereumRpcError<T> extends Error {

  public code: number;

  public data: T | undefined;

  constructor(code: number, message: string, data?: T) {

    if (!Number.isInteger(code)) {
      throw new Error(
        '"code" must be an integer.',
      );
    }
    if (!message || typeof message !== 'string') {
      throw new Error(
        '"message" must be a nonempty string.',
      );
    }

    super(message);
    this.code = code;
    if (data !== undefined) {
      this.data = data;
    }
  }

  /**
   * Returns a plain object with all public class properties.
   */
  serialize(): SerializedEthereumRpcError {
    const serialized: SerializedEthereumRpcError = {
      code: this.code,
      message: this.message,
    };
    if (this.data !== undefined) {
      serialized.data = this.data;
    }
    if (this.stack) {
      serialized.stack = this.stack;
    }
    return serialized;
  }

  /**
   * Return a string representation of the serialized error, omitting
   * any circular references.
   */
  toString(): string {
    return safeStringify(
      this.serialize(),
      stringifyReplacer,
      2,
    );
  }
}

/**
 * Error subclass implementing Ethereum Provider errors per EIP-1193.
 * Permits integer error codes in the [ 1000 <= 4999 ] range.
 */
export class EthereumProviderError<T> extends EthereumRpcError<T> {

  /**
   * Create an Ethereum Provider JSON-RPC error.
   * `code` must be an integer in the [ 1000 <= 4999 ] range.
   */
  constructor(code: number, message: string, data?: T) {

    if (!isValidEthProviderCode(code)) {
      throw new Error(
        '"code" must be an integer such that: 1000 <= code <= 4999',
      );
    }

    super(code, message, data);
  }
}

// Internal

function isValidEthProviderCode(code: number): boolean {
  return Number.isInteger(code) && code >= 1000 && code <= 4999;
}

function stringifyReplacer(_: unknown, value: unknown): unknown {
  if (value === '[Circular]') {
    return undefined;
  }
  return value;
}
