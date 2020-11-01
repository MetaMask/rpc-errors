import { errorCodes, errorValues } from './error-constants';
import { EthereumRpcError, SerializedEthereumRpcError } from './classes';

const FALLBACK_ERROR_CODE = errorCodes.rpc.internal;
const FALLBACK_MESSAGE = 'Unspecified error message. This is a bug, please report it.';
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
 * @param {number} code - The integer error code
 * @param {string} fallbackMessage - The fallback message
 * @return {string} The corresponding message or the fallback message
 */
export function getMessageFromCode(
  code: number,
  fallbackMessage: string = FALLBACK_MESSAGE,
): string {
  if (Number.isInteger(code)) {
    const codeString = code.toString();

    if (hasKey(errorValues, codeString)) {
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
 * A code is only valid if it has a message.
 *
 * @param {number} code - The code to check
 * @return {boolean} true if the code is valid, false otherwise.
 */
export function isValidCode(code: number): boolean {
  if (!Number.isInteger(code)) {
    return false;
  }

  const codeString = code.toString();
  if (errorValues[codeString as ErrorValueKey]) {
    return true;
  }

  if (isJsonRpcServerError(code)) {
    return true;
  }
  return false;
}

/**
 * Serializes the given error to an Ethereum JSON RPC-compatible error object.
 * Merely copies the given error's values if it is already compatible.
 * If the given error is not fully compatible, it will be preserved on the
 * returned object's data.originalError property.
 *
 * @param {any} error - The error to serialize.
 * @param {Object} [options] - An options object.
 * @param {Object} [options.fallbackError] - The custom fallback error values if
 * the given error is invalid.
 * @param {boolean} [options.shouldIncludeStack] - Whether the 'stack' property
 * of the given error should be included on the serialized error, if present.
 * @return {Object} A standardized, plain error object.
 */
export function serializeError(
  error: unknown,
  {
    fallbackError = FALLBACK_ERROR,
    shouldIncludeStack = false,
  } = {},
): SerializedEthereumRpcError {

  if (
    !fallbackError ||
    !Number.isInteger(fallbackError.code) ||
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
    typeof error === 'object' &&
    !Array.isArray(error) &&
    hasKey(error as Record<string, unknown>, 'code') &&
    isValidCode((error as SerializedEthereumRpcError).code)
  ) {
    const _error = error as Partial<SerializedEthereumRpcError>;
    serialized.code = _error.code;

    if (_error.message && typeof _error.message === 'string') {
      serialized.message = _error.message;

      if (hasKey(_error, 'data')) {
        serialized.data = _error.data;
      }
    } else {
      serialized.message = getMessageFromCode(
        (serialized as SerializedEthereumRpcError).code,
      );

      serialized.data = { originalError: assignOriginalError(error) };
    }
  } else {
    serialized.code = fallbackError.code;

    const message = (error as any)?.message;

    serialized.message = (
      message && typeof message === 'string'
        ? message
        : fallbackError.message
    );
    serialized.data = { originalError: assignOriginalError(error) };
  }

  const stack = (error as any)?.stack;

  if (shouldIncludeStack && error && stack && typeof stack === 'string') {
    serialized.stack = stack;
  }
  return serialized as SerializedEthereumRpcError;
}

// Internal

function isJsonRpcServerError(code: number): boolean {
  return code >= -32099 && code <= -32000;
}

function assignOriginalError(error: unknown): unknown {
  if (error && typeof error === 'object' && !Array.isArray(error)) {
    return Object.assign({}, error);
  }
  return error;
}

function hasKey(obj: Record<string, unknown>, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
