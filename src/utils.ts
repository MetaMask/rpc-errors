import type {
  Json,
  JsonRpcError as SerializedJsonRpcError,
  RuntimeObject,
} from '@metamask/utils';
import {
  hasProperty,
  isValidJson,
  isObject,
  isJsonRpcError,
} from '@metamask/utils';

import { errorCodes, errorValues } from './error-constants';

/**
 * A data object, that must be either:
 *
 * - A JSON-serializable object.
 * - An object with a `cause` property that is an error-like value, and any
 * other properties that are JSON-serializable.
 */
export type DataWithOptionalCause =
  | Json
  | {
      // Unfortunately we can't use just `Json` here, because all properties of
      // an object with an index signature must be assignable to the index
      // signature's type. So we have to use `Json | unknown` instead.
      [key: string]: Json | unknown;
      cause?: unknown;
    };

/**
 * A data object, that must be either:
 *
 * - A valid DataWithOptionalCause value.
 * - undefined.
 */
export type OptionalDataWithOptionalCause = undefined | DataWithOptionalCause;

const FALLBACK_ERROR_CODE = errorCodes.rpc.internal;
const FALLBACK_MESSAGE =
  'Unspecified error message. This is a bug, please report it.';
const FALLBACK_ERROR: SerializedJsonRpcError = {
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
  code: unknown,
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
export function isValidCode(code: unknown): code is number {
  return Number.isInteger(code);
}

/**
 * Serializes the given error to an Ethereum JSON RPC-compatible error object.
 * If the given error is not fully compatible, it will be preserved on the
 * returned object's data.cause property.
 *
 * @param error - The error to serialize.
 * @param options - Options bag.
 * @param options.fallbackError - The error to return if the given error is
 * not compatible. Should be a JSON-serializable value.
 * @param options.shouldIncludeStack - Whether to include the error's stack
 * on the returned object.
 * @param options.shouldPreserveMessage - Whether to preserve the error's
 * message if the fallback error is used.
 * @returns The serialized error.
 */
export function serializeError(
  error: unknown,
  {
    fallbackError = FALLBACK_ERROR,
    shouldIncludeStack = true,
    shouldPreserveMessage = true,
  } = {},
): SerializedJsonRpcError {
  if (!isJsonRpcError(fallbackError)) {
    throw new Error(
      'Must provide fallback error with integer number code and string message.',
    );
  }

  const serialized = buildError(error, fallbackError, shouldPreserveMessage);

  if (!shouldIncludeStack) {
    delete serialized.stack;
  }

  return serialized;
}

/**
 * Construct a JSON-serializable object given an error and a JSON-serializable `fallbackError`
 *
 * @param error - The error in question.
 * @param fallbackError - A JSON-serializable fallback error.
 * @param shouldPreserveMessage - Whether to preserve the error's message if the fallback
 * error is used.
 * @returns A JSON-serializable error object.
 */
function buildError(
  error: unknown,
  fallbackError: SerializedJsonRpcError,
  shouldPreserveMessage: boolean,
): SerializedJsonRpcError {
  // If an error specifies a `serialize` function, we call it and return the result.
  if (
    error &&
    typeof error === 'object' &&
    'serialize' in error &&
    typeof error.serialize === 'function'
  ) {
    return error.serialize();
  }

  if (isJsonRpcError(error)) {
    return error;
  }

  const originalMessage = getOriginalMessage(error);

  // If the error does not match the JsonRpcError type, use the fallback error, but try to include the original error as `cause`.
  const cause = serializeCause(error);
  const fallbackWithCause = {
    ...fallbackError,
    ...(shouldPreserveMessage &&
      originalMessage && { message: originalMessage }),
    data: { cause },
  };

  return fallbackWithCause;
}

/**
 * Attempts to extract the original `message` property from an error value of uncertain shape.
 *
 * @param error - The error in question.
 * @returns The original message, if it exists and is a non-empty string.
 */
function getOriginalMessage(error: unknown): string | undefined {
  if (
    isObject(error) &&
    hasProperty(error, 'message') &&
    typeof error.message === 'string' &&
    error.message.length > 0
  ) {
    return error.message;
  }
  return undefined;
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
 * Serializes an unknown error to be used as the `cause` in a fallback error.
 *
 * @param error - The unknown error.
 * @returns A JSON-serializable object containing as much information about the original error as possible.
 */
export function serializeCause(error: unknown): Json {
  if (Array.isArray(error)) {
    return error.map((entry) => {
      if (isValidJson(entry)) {
        return entry;
      } else if (isObject(entry)) {
        return serializeObject(entry);
      }
      return null;
    });
  } else if (isObject(error)) {
    return serializeObject(error);
  }

  if (isValidJson(error)) {
    return error;
  }

  return null;
}

/**
 * Extracts all JSON-serializable properties from an object.
 *
 * @param object - The object in question.
 * @returns An object containing all the JSON-serializable properties.
 */
function serializeObject(object: RuntimeObject): Json {
  return Object.getOwnPropertyNames(object).reduce<Record<string, Json>>(
    (acc, key) => {
      const value = object[key];
      if (isValidJson(value)) {
        acc[key] = value;
      }

      return acc;
    },
    {},
  );
}

/**
 * Returns true if supplied error data has a usable `cause` property; false otherwise.
 *
 * @param data - Optional data to validate.
 * @returns Whether cause property is present and an object.
 */
export function dataHasCause(data: unknown): data is {
  [key: string]: Json | unknown;
  cause: object;
} {
  return isObject(data) && hasProperty(data, 'cause') && isObject(data.cause);
}
