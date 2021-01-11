import safeStringify from 'fast-safe-stringify';
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
    !Array.isArray(error)
  ) {
    const _error = error as Partial<SerializedEthereumRpcError>;

    if (
      hasKey(_error, 'code') &&
      isValidCode((_error as SerializedEthereumRpcError).code)
    ) {
      serialized.code = _error.code;
    } else {
      serialized.code = fallbackError.code;
    }

    if (
      hasKey(_error, 'message') &&
      typeof (_error as SerializedEthereumRpcError).message === 'string'
    ) {
      serialized.message = _error.message;
    } else if (serialized.code === fallbackError.code) {
      serialized.message = fallbackError.message;
    } else {
      serialized.message = getMessageFromCode((
        serialized as SerializedEthereumRpcError).code);
    }

    if (hasKey(_error, 'data')) {
      serialized.data = _error.data;
    }

    if (
      shouldIncludeStack &&
      hasKey(_error, 'stack') &&
      typeof (_error as SerializedEthereumRpcError).stack === 'string'
    ) {
      serialized.stack = _error.stack;
    }
  } else {
    serialized.code = fallbackError.code;
    serialized.message = fallbackError.message;

    const originalError = safeStringify(error);
    if (originalError) {
      serialized.data = { originalError };
    }
  }

  return serialized as SerializedEthereumRpcError;
}

// Internal

function isJsonRpcServerError(code: number): boolean {
  return code >= -32099 && code <= -32000;
}

function hasKey(obj: Record<string, unknown>, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
