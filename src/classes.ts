import safeStringify from 'fast-safe-stringify';

/**
 * Error subclass implementing JSON RPC 2.0 errors and Ethereum RPC errors
 * per EIP 1474. Permits any integer error code.
 */
export class EthereumRpcError extends Error {
  code: number;

  data?: any;

  /**
   * Create an Ethereum JSON RPC error.
   *
   * @param code - The integer error code.
   * @param [message] - The string message.
   * @param [data] - The error data.
   */
  constructor (code: number, message?: string, data?: any) {
    if (!Number.isInteger(code)) {
      throw new Error(
        '"code" must be an integer.'
      );
    }
    if (typeof message !== 'string') {
      throw new Error(
        '"message" must be a nonempty string.'
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
   *
   * @returns The serialized error.
   */
  serialize () {
    const serialized: any = {
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
   *
   * @returns The serialized error as a string.
   */
  toString () {
    return safeStringify(
      this.serialize(),
      stringifyReplacer,
      2
    );
  }
}

/**
 * Error subclass implementing Ethereum Provider errors per EIP 1193.
 * Permits integer error codes in the [ 1000 <= 4999 ] range.
 */
export class EthereumProviderError extends EthereumRpcError {

  /**
   * Create an Ethereum JSON RPC error.
   *
   * @param code - The integer error code, in the [ 1000 <= 4999 ] range.
   * @param message - The string message.
   * @param [data] - The error data.
   */
  constructor (code: number, message: string, data: any) {
    if (!isValidEthProviderCode(code)) {
      throw new Error(
        '"code" must be an integer such that: 1000 <= code <= 4999'
      );
    }

    super(code, message, data);
  }
}

function isValidEthProviderCode (code: any): code is number {
  return Number.isInteger(code) && code >= 1000 && code <= 4999;
}

function stringifyReplacer (_: string, value: any) {
  if (value === '[Circular]') {
    return undefined;
  }
  return value;
}
