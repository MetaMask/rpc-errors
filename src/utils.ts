import { hasProperty, isPlainObject, Json } from '@metamask/utils';
import { errorCodes, errorValues } from './error-constants';
import { EthereumRpcError, SerializedEthereumRpcError } from './classes';

const FALLBACK_ERROR_CODE = errorCodes.rpc.internal;
const FALLBACK_MESSAGE = 'Invalid internal error. See "data.originalError" for original value. Please report this bug.';
const FALLBACK_ERROR: SerializedEthereumRpcError = {
  code: FALLBACK_ERROR_CODE,
  message: getMessageFromCode(FALLBACK_ERROR_CODE),
};

export const JSON_RPC_SERVER_ERROR_MESSAGE = 'Unspecified server error.';

type ErrorValueKey = keyof typeof errorValues;

/**
 * Gets the message for a given code, or a fallback message if the code has
 * no corresponding message.
 *
 * @param code - The error code.
 * @param fallbackMessage - The fallback message to use if the code has no
 * corresponding message.
 * @returns The message for the given code, or the fallback message if the code
 * has no corresponding message.
 */
export function getMessageFromCode(
  code: number,
  fallbackMessage: string = FALLBACK_MESSAGE,
): string {
  if (isValidCode(code)) {
    const codeString = code.toString();

    if (hasProperty(errorValues, codeString)) {
      return errorValues[codeString as ErrorValueKey].message;
    }

    if (isJsonRpcServerError(code)) {
      return JSON_RPC_SERVER_ERROR_MESSAGE;
    }
  }
  return fallbackMessage;
}

/**
 * Returns whether the given code is valid.
 * A code is valid if it is an integer.
 *
 * @param code - The error code.
 * @returns Whether the given code is valid.
 */
export function isValidCode(code: number): boolean {
  return Number.isInteger(code);
}

/**
 * Serializes the given error to an Ethereum JSON RPC-compatible error object.
 * Merely copies the given error's values if it is already compatible.
 * If the given error is not fully compatible, it will be preserved on the
 * returned object's data.originalError property.
 *
 * @param error - The error to serialize.
 * @param options - Options bag.
 * @param options.fallbackError - The error to return if the given error is
 * not compatible.
 * @param options.shouldIncludeStack - Whether to include the error's stack
 * on the returned object.
 * @returns The serialized error.
 */
export function serializeError(
  error: unknown,
  { fallbackError = FALLBACK_ERROR, shouldIncludeStack = false } = {},
): SerializedEthereumRpcError {
  if (
    !fallbackError ||
    !isValidCode(fallbackError.code) ||
    typeof fallbackError.message !== 'string'
  ) {
    throw new Error(
      'Must provide fallback error with integer number code and string message.',
    );
  }

  if (error instanceof EthereumRpcError) {
    return error.serialize();
  }

  const serialized: Partial<SerializedEthereumRpcError> = {};

  if (
    error &&
    isPlainObject(error) &&
    hasProperty(error, 'code') &&
    isValidCode((error as SerializedEthereumRpcError).code)
  ) {
    const _error = error as Partial<SerializedEthereumRpcError>;
    serialized.code = _error.code as number;

    if (_error.message && typeof _error.message === 'string') {
      serialized.message = _error.message;

      if (hasProperty(_error, 'data')) {
        serialized.data = _error.data ?? null;
      }
    } else {
      serialized.message = getMessageFromCode(
        (serialized as SerializedEthereumRpcError).code,
      );

      // TODO: Verify that the original error is serializable.
      serialized.data = { originalError: assignOriginalError(error) } as Json;
    }
  } else {
    serialized.code = fallbackError.code;

    const message = (error as any)?.message;

    serialized.message =
      message && typeof message === 'string' ? message : fallbackError.message;

    // TODO: Verify that the original error is serializable.
    serialized.data = { originalError: assignOriginalError(error) } as Json;
  }

  const stack = (error as any)?.stack;

  if (shouldIncludeStack && error && stack && typeof stack === 'string') {
    serialized.stack = stack;
  }
  return serialized as SerializedEthereumRpcError;
}

/**
 * Check if the given code is a valid JSON-RPC server error code.
 *
 * @param code - The error code.
 * @returns Whether the given code is a valid JSON-RPC server error code.
 */
function isJsonRpcServerError(code: number): boolean {
  return code >= -32099 && code <= -32000;
}

/**
 * Create a copy of the given value if it's an object, and not an array.
 *
 * @param error - The value to copy.
 * @returns The copied value, or the original value if it's not an object.
 */
function assignOriginalError(error: unknown): unknown {
  if (error && typeof error === 'object' && !Array.isArray(error)) {
    return Object.assign({}, error);
  }
  return error;
}
