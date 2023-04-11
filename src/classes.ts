import safeStringify from 'fast-safe-stringify';
import { Json, JsonRpcError } from '@metamask/utils';

export { JsonRpcError };

/**
 * Error subclass implementing JSON RPC 2.0 errors and Ethereum RPC errors
 * per EIP-1474.
 *
 * Permits any integer error code.
 */
export class EthereumRpcError<T extends Json> extends Error {
  public code: number;

  public data?: T;

  constructor(code: number, message: string, data?: T) {
    if (!Number.isInteger(code)) {
      throw new Error('"code" must be an integer.');
    }

    if (!message || typeof message !== 'string') {
      throw new Error('"message" must be a nonempty string.');
    }

    super(message);
    this.code = code;
    if (data !== undefined) {
      this.data = data;
    }
  }

  /**
   * Get the error as JSON-serializable object.
   *
   * @returns A plain object with all public class properties.
   */
  serialize(): JsonRpcError {
    const serialized: JsonRpcError = {
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
   * Get a string representation of the serialized error, omitting any circular
   * references.
   *
   * @returns A string representation of the serialized error.
   */
  toString(): string {
    return safeStringify(this.serialize(), stringifyReplacer, 2);
  }
}

/**
 * Error subclass implementing Ethereum Provider errors per EIP-1193.
 * Permits integer error codes in the [ 1000 <= 4999 ] range.
 */
export class EthereumProviderError<T extends Json> extends EthereumRpcError<T> {
  /**
   * Create an Ethereum Provider JSON-RPC error.
   *
   * @param code - The JSON-RPC error code. Must be an integer in the
   * `1000 <= n <= 4999` range.
   * @param message - The JSON-RPC error message.
   * @param data - Optional data to include in the error.
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

/**
 * Check if the given code is a valid JSON-RPC error code.
 *
 * @param code - The code to check.
 * @returns Whether the code is valid.
 */
function isValidEthProviderCode(code: number): boolean {
  return Number.isInteger(code) && code >= 1000 && code <= 4999;
}

/**
 * A JSON replacer function that omits circular references.
 *
 * @param _ - The key being replaced.
 * @param value - The value being replaced.
 * @returns The value to use in place of the original value.
 */
function stringifyReplacer(_: unknown, value: unknown): unknown {
  if (value === '[Circular]') {
    return undefined;
  }

  return value;
}
