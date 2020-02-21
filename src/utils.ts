import { EthereumRpcError } from './classes';
import errorValues from './errorValues';
import errorCodes from './errorCodes';

const FALLBACK_ERROR_CODE = errorCodes.rpc.internal;
export const JSON_RPC_SERVER_ERROR_MESSAGE = 'Unspecified server error.';
const FALLBACK_MESSAGE = 'Unspecified error message. This is a bug, please report it.';

const FALLBACK_ERROR = {
  code: FALLBACK_ERROR_CODE,
  message: getMessageFromCode(FALLBACK_ERROR_CODE),
};

/**
 * Gets the message for a given code, or a fallback message if the code has
 * no corresponding message.
 *
 * @param {number} code - The integer error code
 * @param {string} fallbackMessage - The fallback message
 * @return {string} The corresponding message or the fallback message
 */
export function getMessageFromCode (code: number, fallbackMessage = FALLBACK_MESSAGE) {
  if (Number.isInteger(code)) {
    const codeString = code.toString();
    const errorValue = errorValues[codeString];
    if (errorValue) {
      return errorValue.message;
    }

    if (isJsonRpcServerError(code)) {
      return JSON_RPC_SERVER_ERROR_MESSAGE;
    }

    // TODO: allow valid codes and messages to be extended
    // EIP 1193 Status Codes
    // if (code >= 4000 && code <= 4999) return Something?
  }
  return fallbackMessage;
}

/**
 * Returns whether the given code is valid.
 * A code is only valid if it has a message.
 *
 * @param code - The code to check
 * @return true if the code is valid, false otherwise.
 */
export function isValidCode (code: number) {
  if (!Number.isInteger(code)) {
    return false;
  }

  const codeString = code.toString();
  if (errorValues[codeString]) {
    return true;
  }

  if (isJsonRpcServerError(code)) {
    return true;
  }

  // TODO: allow valid codes and messages to be extended
  // // EIP 1193 Status Codes
  // if (code >= 4000 && code <= 4999) return true

  return false;
}

/**
 * Serializes the given error to an Ethereum JSON RPC-compatible error object.
 *
 * Merely copies the given error's values if it is already compatible.
 * If the given error is not fully compatible, it will be preserved on the
 * returned object's data.originalError property.
 * Adds a 'stack' property if it exists on the given error.
 *
 * @param error - The error to serialize.
 * @param fallbackError - The custom fallback error values if the given error is invalid.
 * @return A standardized error object.
 */
export function serializeError (error: any, fallbackError: any = FALLBACK_ERROR) {
  if (
    !fallbackError ||
    !Number.isInteger(fallbackError.code) ||
    typeof fallbackError.message !== 'string'
  ) {
    throw new Error(
      'fallbackError must contain integer number code and string message.'
    );
  }

  if (error instanceof EthereumRpcError) {
    return error.serialize();
  }

  const serialized: any = {};

  if (error && isValidCode(error.code)) {

    serialized.code = error.code;

    if (error.message && typeof error.message === 'string') {
      serialized.message = error.message;
      if (Object.hasOwnProperty.call(error, 'data')) {
        serialized.data = error.data;
      }
    } else {
      serialized.message = getMessageFromCode(serialized.code);
      serialized.data = { originalError: assignOriginalError(error) };
    }

  } else {
    serialized.code = fallbackError.code;
    serialized.message =
      error?.message
        ? error.message
        : fallbackError.message;

    serialized.data = { originalError: assignOriginalError(error) };
  }

  if (error?.stack) {
    serialized.stack = error.stack;
  }
  return serialized;
}

function isJsonRpcServerError (code: number) {
  return code >= -32099 && code <= -32000;
}

function assignOriginalError (error: unknown) {
  if (error && typeof error === 'object' && !Array.isArray(error)) {
    return { ...error };
  }
  return error;
}
