import type {
  Json,
  JsonRpcError as SerializedJsonRpcError,
} from '@metamask/utils';
import { hasProperty, isPlainObject } from '@metamask/utils';
import safeStringify from 'fast-safe-stringify';

import type { OptionalDataWithOptionalCause } from './utils';
import { dataHasCause, serializeCause } from './utils';

export type { SerializedJsonRpcError };

/**
 * Error subclass implementing JSON RPC 2.0 errors and Ethereum RPC errors
 * per EIP-1474.
 *
 * Permits any integer error code.
 */
export class JsonRpcError<
  Data extends OptionalDataWithOptionalCause,
> extends Error {
  // The `cause` definition can be removed when tsconfig lib and/or target have changed to >=es2022
  public cause?: unknown;

  public code: number;

  public data?: Data;

  constructor(code: number, message: string, data?: Data) {
    if (!Number.isInteger(code)) {
      throw new Error('"code" must be an integer.');
    }

    if (!message || typeof message !== 'string') {
      throw new Error('"message" must be a non-empty string.');
    }

    if (dataHasCause(data)) {
      // @ts-expect-error - Error class does accept options argument depending on runtime, but types are mapping to oldest supported
      super(message, { cause: data.cause });

      // Browser backwards-compatibility fallback
      if (!hasProperty(this, 'cause')) {
        Object.assign(this, { cause: data.cause });
      }
    } else {
      super(message);
    }

    if (data !== undefined) {
      this.data = data;
    }

    this.code = code;
  }

  /**
   * Get the error as JSON-serializable object.
   *
   * @returns A plain object with all public class properties.
   */
  serialize(): SerializedJsonRpcError {
    const serialized: SerializedJsonRpcError = {
      code: this.code,
      message: this.message,
    };

    if (this.data !== undefined) {
      // `this.data` is not guaranteed to be a plain object, but this simplifies
      // the type guard below. We can safely cast it because we know it's a
      // JSON-serializable value.
      serialized.data = this.data as { [key: string]: Json };

      if (isPlainObject(this.data)) {
        serialized.data.cause = serializeCause(this.data.cause);
      }
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
export class EthereumProviderError<
  Data extends OptionalDataWithOptionalCause,
> extends JsonRpcError<Data> {
  /**
   * Create an Ethereum Provider JSON-RPC error.
   *
   * @param code - The JSON-RPC error code. Must be an integer in the
   * `1000 <= n <= 4999` range.
   * @param message - The JSON-RPC error message.
   * @param data - Optional data to include in the error.
   */
  constructor(code: number, message: string, data?: Data) {
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
