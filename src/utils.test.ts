import { errorCodes, rpcErrors } from '.';
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
  dummyData,
} from './__fixtures__';
import { dataHasCause, getMessageFromCode, serializeError } from './utils';

const rpcCodes = errorCodes.rpc;

describe('serializeError', () => {
  it('serializes invalid error: non-object', () => {
    const result = serializeError(invalidError0);
    expect(result).toStrictEqual({
      code: rpcCodes.internal,
      message: getMessageFromCode(rpcCodes.internal),
      data: { cause: invalidError0 },
    });
  });

  it('serializes invalid error: null', () => {
    const result = serializeError(invalidError5);
    expect(result).toStrictEqual({
      code: rpcCodes.internal,
      message: getMessageFromCode(rpcCodes.internal),
      data: { cause: invalidError5 },
    });
  });

  it('serializes invalid error: undefined', () => {
    const result = serializeError(invalidError6);
    expect(result).toStrictEqual({
      code: rpcCodes.internal,
      message: getMessageFromCode(rpcCodes.internal),
      data: { cause: null },
    });
  });

  it('serializes invalid error: array', () => {
    const result = serializeError(invalidError1);
    expect(result).toStrictEqual({
      code: rpcCodes.internal,
      message: getMessageFromCode(rpcCodes.internal),
      data: { cause: invalidError1 },
    });
  });

  it('serializes invalid error: array with non-JSON values', () => {
    const error = ['foo', Symbol('bar'), { baz: 'qux', symbol: Symbol('') }];
    const result = serializeError(error);
    expect(result).toStrictEqual({
      code: rpcCodes.internal,
      message: getMessageFromCode(rpcCodes.internal),
      data: {
        cause: ['foo', null, { baz: 'qux' }],
      },
    });

    expect(JSON.parse(JSON.stringify(result))).toStrictEqual({
      code: rpcCodes.internal,
      message: getMessageFromCode(rpcCodes.internal),
      data: {
        cause: ['foo', null, { baz: 'qux' }],
      },
    });
  });

  it('serializes invalid error: invalid code', () => {
    const result = serializeError(invalidError2);
    expect(result).toStrictEqual({
      code: rpcCodes.internal,
      message: getMessageFromCode(rpcCodes.internal),
      data: { cause: invalidError2 },
    });
  });

  it('serializes invalid error: valid code, undefined message', () => {
    const result = serializeError(invalidError3);
    expect(result).toStrictEqual({
      code: errorCodes.rpc.internal,
      message: getMessageFromCode(errorCodes.rpc.internal),
      data: {
        cause: {
          code: 4001,
        },
      },
    });
  });

  it('serializes invalid error: non-string message with data', () => {
    const result = serializeError(invalidError4);
    expect(result).toStrictEqual({
      code: rpcCodes.internal,
      message: getMessageFromCode(rpcCodes.internal),
      data: {
        cause: {
          code: invalidError4.code,
          message: invalidError4.message,
          data: Object.assign({}, dummyData),
        },
      },
    });
  });

  it('serializes invalid error: invalid code with string message', () => {
    const result = serializeError(invalidError7);
    expect(result).toStrictEqual({
      code: rpcCodes.internal,
      message: invalidError7.message,
      data: {
        cause: {
          code: invalidError7.code,
          message: invalidError7.message,
          data: Object.assign({}, dummyData),
        },
      },
    });
  });

  it('serializes invalid error: invalid code, no message, custom fallback', () => {
    const result = serializeError(invalidError2, {
      fallbackError: { code: rpcCodes.methodNotFound, message: 'foo' },
    });
    expect(result).toStrictEqual({
      code: rpcCodes.methodNotFound,
      message: 'foo',
      data: { cause: Object.assign({}, invalidError2) },
    });
  });

  it('serializes valid error: code and message only', () => {
    const result = serializeError(validError0);
    expect(result).toStrictEqual({
      code: 4001,
      message: validError0.message,
    });
  });

  it('serializes valid error: code, message, and data', () => {
    const result = serializeError(validError1);
    expect(result).toStrictEqual({
      code: 4001,
      message: validError1.message,
      data: Object.assign({}, validError1.data),
    });
  });

  it('serializes valid error: instantiated error', () => {
    const result = serializeError(validError2);
    expect(result).toStrictEqual({
      code: rpcCodes.parse,
      message: getMessageFromCode(rpcCodes.parse),
    });
  });

  it('serializes valid error: other instantiated error', () => {
    const result = serializeError(validError3);
    expect(result).toStrictEqual({
      code: rpcCodes.parse,
      message: dummyMessage,
    });
  });

  it('serializes valid error: instantiated error with custom message and data', () => {
    const result = serializeError(validError4);
    expect(result).toStrictEqual({
      code: rpcCodes.parse,
      message: validError4.message,
      data: Object.assign({}, validError4.data),
    });
  });

  it('serializes valid error: message and data', () => {
    const result = serializeError(Object.assign({}, validError1));
    expect(result).toStrictEqual({
      code: 4001,
      message: validError1.message,
      data: Object.assign({}, validError1.data),
    });
  });

  it('serializes valid error: no stack present', () => {
    const result = serializeError(validError1);
    expect(result).toStrictEqual({
      code: 4001,
      message: validError1.message,
      data: Object.assign({}, validError1.data),
    });
  });

  it('serializes valid error: string stack present', () => {
    const result = serializeError(
      Object.assign({}, validError1, { stack: 'foo' }),
    );
    expect(result).toStrictEqual({
      code: 4001,
      message: validError1.message,
      data: Object.assign({}, validError1.data),
      stack: 'foo',
    });
  });

  it('removes the stack with `shouldIncludeStack: false`', () => {
    const result = serializeError(
      Object.assign({}, validError1, { stack: 'foo' }),
      { shouldIncludeStack: false },
    );
    expect(result).toStrictEqual({
      code: 4001,
      message: validError1.message,
      data: Object.assign({}, validError1.data),
    });
  });

  it('overwrites the original message with `shouldPreserveMessage: false`', () => {
    const error = new Error('foo');
    const result = serializeError(error, {
      shouldPreserveMessage: false,
      fallbackError: validError0,
    });
    expect(result).toStrictEqual({
      code: validError0.code,
      message: validError0.message,
      data: {
        cause: {
          message: error.message,
          stack: error.stack,
        },
      },
    });
  });

  it('serializes invalid error: Error', () => {
    const error = new Error('foo');
    const result = serializeError(error);
    expect(result).toStrictEqual({
      code: errorCodes.rpc.internal,
      message: error.message,
      data: {
        cause: {
          message: error.message,
          stack: error.stack,
        },
      },
    });

    expect(JSON.parse(JSON.stringify(result))).toStrictEqual({
      code: errorCodes.rpc.internal,
      message: error.message,
      data: {
        cause: {
          message: error.message,
          stack: error.stack,
        },
      },
    });
  });

  it('serializes valid error: JsonRpcError', () => {
    const error = rpcErrors.invalidParams();
    const result = serializeError(error);
    expect(result).toStrictEqual({
      code: error.code,
      message: error.message,
      stack: error.stack,
    });

    expect(JSON.parse(JSON.stringify(result))).toStrictEqual({
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
  });

  it('serializes error with serialize() method', () => {
    class MockClass {
      serialize() {
        return { code: 1, message: 'foo' };
      }
    }
    const error = new MockClass();
    const result = serializeError(error);
    expect(result).toStrictEqual({
      code: 1,
      message: 'foo',
    });

    expect(JSON.parse(JSON.stringify(result))).toStrictEqual({
      code: 1,
      message: 'foo',
    });
  });

  it('removes non JSON-serializable props on cause', () => {
    const error = new Error('foo');
    // @ts-expect-error Intentionally using wrong type
    error.message = () => undefined;
    const result = serializeError(error);
    expect(result).toStrictEqual({
      code: errorCodes.rpc.internal,
      message: getMessageFromCode(errorCodes.rpc.internal),
      data: {
        cause: {
          stack: error.stack,
        },
      },
    });
  });

  it('throws if fallback is invalid', () => {
    expect(() =>
      // @ts-expect-error Intentionally using wrong type
      serializeError(new Error(), { fallbackError: new Error() }),
    ).toThrow(
      'Must provide fallback error with integer number code and string message.',
    );
  });
});

describe('dataHasCause', () => {
  it('returns false for invalid data types', () => {
    [undefined, null, 'hello', 1234].forEach((data) => {
      const result = dataHasCause(data);
      expect(result).toBe(false);
    });
  });
  it('returns false for invalid cause types', () => {
    [undefined, null, 'hello', 1234].forEach((cause) => {
      const result = dataHasCause({ cause });
      expect(result).toBe(false);
    });
  });
  it('returns true when cause is object', () => {
    const data = { cause: {} };
    const result = dataHasCause(data);
    expect(result).toBe(true);
  });
});
