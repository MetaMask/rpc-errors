import {
  invalidError0,
  invalidError1,
  invalidError2,
  invalidError3,
  invalidError4,
  invalidError5,
  invalidError6,
  invalidError7,
  validError0,
  validError1,
  validError2,
  validError3,
  validError4,
  dummyMessage,
} from './__fixtures__';
import { getMessageFromCode, serializeError } from './utils';
import { errorCodes } from '.';

const rpcCodes = errorCodes.rpc;

describe('serializeError', () => {
  it('handles invalid error: non-object', () => {
    const result = serializeError(invalidError0);
    expect(result).toStrictEqual({
      code: rpcCodes.internal,
      message: getMessageFromCode(rpcCodes.internal),
      data: { originalError: invalidError0 },
    });
  });

  it('handles invalid error: null', () => {
    const result = serializeError(invalidError5);
    expect(result).toStrictEqual({
      code: rpcCodes.internal,
      message: getMessageFromCode(rpcCodes.internal),
      data: { originalError: invalidError5 },
    });
  });

  it('handles invalid error: undefined', () => {
    const result = serializeError(invalidError6);
    expect(result).toStrictEqual({
      code: rpcCodes.internal,
      message: getMessageFromCode(rpcCodes.internal),
      data: { originalError: invalidError6 },
    });
  });

  it('handles invalid error: array', () => {
    const result = serializeError(invalidError1);
    expect(result).toStrictEqual({
      code: rpcCodes.internal,
      message: getMessageFromCode(rpcCodes.internal),
      data: { originalError: invalidError1 },
    });
  });

  it('handles invalid error: invalid code', () => {
    const result = serializeError(invalidError2);
    expect(result).toStrictEqual({
      code: rpcCodes.internal,
      message: getMessageFromCode(rpcCodes.internal),
      data: { originalError: invalidError2 },
    });
  });

  it('handles invalid error: valid code, undefined message', () => {
    const result = serializeError(invalidError3);
    expect(result).toStrictEqual({
      code: 4001,
      message: getMessageFromCode(4001),
      data: { originalError: Object.assign({}, invalidError3) },
    });
  });

  it('handles invalid error: non-string message with data', () => {
    const result = serializeError(invalidError4);
    expect(result).toStrictEqual({
      code: 4001,
      message: getMessageFromCode(4001),
      data: { originalError: Object.assign({}, invalidError4) },
    });
  });

  it('handles invalid error: invalid code with string message', () => {
    const result = serializeError(invalidError7);
    expect(result).toStrictEqual({
      code: rpcCodes.internal,
      message: dummyMessage,
      data: { originalError: Object.assign({}, invalidError7) },
    });
  });

  it('handles invalid error: invalid code, no message, custom fallback', () => {
    const result = serializeError(invalidError2, {
      fallbackError: { code: rpcCodes.methodNotFound, message: 'foo' },
    });
    expect(result).toStrictEqual({
      code: rpcCodes.methodNotFound,
      message: 'foo',
      data: { originalError: Object.assign({}, invalidError2) },
    });
  });

  it('handles valid error: code and message only', () => {
    const result = serializeError(validError0);
    expect(result).toStrictEqual({
      code: 4001,
      message: validError0.message,
    });
  });

  it('handles valid error: code, message, and data', () => {
    const result = serializeError(validError1);
    expect(result).toStrictEqual({
      code: 4001,
      message: validError1.message,
      data: Object.assign({}, validError1.data),
    });
  });

  it('handles valid error: instantiated error', () => {
    const result = serializeError(validError2);
    expect(result).toStrictEqual({
      code: rpcCodes.parse,
      message: getMessageFromCode(rpcCodes.parse),
    });
  });

  it('handles valid error: instantiated error', () => {
    const result = serializeError(validError3);
    expect(result).toStrictEqual({
      code: rpcCodes.parse,
      message: dummyMessage,
    });
  });

  it('handles valid error: instantiated error with custom message and data', () => {
    const result = serializeError(validError4);
    expect(result).toStrictEqual({
      code: rpcCodes.parse,
      message: validError4.message,
      data: Object.assign({}, validError4.data),
    });
  });

  it('handles valid error: message, data, and stack', () => {
    const result = serializeError(
      Object.assign({}, validError1, { stack: 'foo' }),
    );
    expect(result).toStrictEqual({
      code: 4001,
      message: validError1.message,
      data: Object.assign({}, validError1.data),
    });
  });

  it('handles including stack: no stack present', () => {
    const result = serializeError(validError1, { shouldIncludeStack: true });
    expect(result).toStrictEqual({
      code: 4001,
      message: validError1.message,
      data: Object.assign({}, validError1.data),
    });
  });

  it('handles including stack: string stack present', () => {
    const result = serializeError(
      Object.assign({}, validError1, { stack: 'foo' }),
      { shouldIncludeStack: true },
    );
    expect(result).toStrictEqual({
      code: 4001,
      message: validError1.message,
      data: Object.assign({}, validError1.data),
      stack: 'foo',
    });
  });

  it('handles including stack: non-string stack present', () => {
    const result = serializeError(
      Object.assign({}, validError1, { stack: 2 }),
      {
        shouldIncludeStack: true,
      },
    );
    expect(result).toStrictEqual({
      code: 4001,
      message: validError1.message,
      data: Object.assign({}, validError1.data),
    });
  });
});
