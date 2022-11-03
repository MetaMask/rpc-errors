import {
  hasProperty,
  JsonRpcErrorStruct,
  isValidJson,
  isObject,
  isJsonRpcError,
  Json,
} from '@metamask/utils';
import { create, is, partial } from 'superstruct';
import { errorCodes, errorValues } from './error-constants';
import { EthereumRpcError, SerializedEthereumRpcError } from './classes';

const FALLBACK_ERROR_CODE = errorCodes.rpc.internal;
const FALLBACK_MESSAGE =
  'Invalid internal error. See "data.cause" for original value. Please report this bug.';
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
 * returned object's data.cause property.
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
  if (!isJsonRpcError(fallbackError)) {
    throw new Error(
      'Must provide fallback error with integer number code and string message.',
    );
  }

  if (error instanceof EthereumRpcError) {
    return error.serialize();
  }

  const serialized = buildError(
    error,
    fallbackError as SerializedEthereumRpcError,
  );

  if (!shouldIncludeStack) {
    delete serialized.stack;
  }

  return serialized as SerializedEthereumRpcError;
}

const PartialJsonRpcErrorStruct = partial(JsonRpcErrorStruct);

const ERROR_KEYS = Object.keys(JsonRpcErrorStruct.schema);

/**
 * Constructs a JSON serializable object given an error and a fallbackError.
 *
 * @param error - The error in question.
 * @param fallbackError - The fallback error.
 * @returns A JSON serializable error object.
 */
function buildError(error: unknown, fallbackError: SerializedEthereumRpcError) {
  if (isJsonRpcError(error)) {
    return create(error, JsonRpcErrorStruct);
  }

  // If the original error is a partial JSON-RPC error, extract matching keys and merge with fallback error
  if (is(error, PartialJsonRpcErrorStruct)) {
    const subset = ERROR_KEYS.reduce((acc, key) => {
      if (hasProperty(error, key)) {
        // @ts-expect-error TODO: Fix type
        acc[key] = error[key];
      }
      return acc;
    }, {});
    return { ...fallbackError, ...subset };
  }

  // TODO: If the original error is an object, we make a copy of it, this should also copy class properties to an object
  const cause = isObject(error) ? getCause(error) : error;
  const fallbackWithCause = {
    ...fallbackError,
    data: { cause },
  };

  return fallbackWithCause;
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
 * Get cause from an object or a class, extracting all properties.
 *
 * @param error - The error class or object.
 * @returns An object containing all the error properties.
 */
function getCause<T>(error: T): Json {
  return Object.getOwnPropertyNames(error).reduce((acc, key) => {
    const value = error[key as keyof T];
    if (isValidJson(value)) {
      return {
        ...acc,
        [key]: value,
      };
    }

    return acc;
  }, {});
}
