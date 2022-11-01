import { getMessageFromCode, serializeError } from "./utils";
import { ethErrors, errorCodes } from ".";

const rpcCodes = errorCodes.rpc;

const dummyData = { foo: "bar" };
const dummyMessage = "baz";

const invalidError0 = 0;
const invalidError1 = ["foo", "bar", 3];
const invalidError2 = { code: 34 };
const invalidError3 = { code: 4001 };
const invalidError4 = {
  code: 4001,
  message: 3,
  data: Object.assign({}, dummyData),
};
const invalidError5 = null;
const invalidError6 = undefined;
const invalidError7 = {
  code: 34,
  message: dummyMessage,
  data: Object.assign({}, dummyData),
};

const validError0 = { code: 4001, message: dummyMessage };
const validError1 = {
  code: 4001,
  message: dummyMessage,
  data: Object.assign({}, dummyData),
};
const validError2 = ethErrors.rpc.parse();
delete validError2.stack;
const validError3 = ethErrors.rpc.parse(dummyMessage);
delete validError3.stack;
const validError4 = ethErrors.rpc.parse({
  message: dummyMessage,
  data: Object.assign({}, dummyData),
});
delete validError4.stack;

describe("serializeError", () => {
  it("invalid error: non-object", () => {
    const result = serializeError(invalidError0);
    expect(result).toStrictEqual({
      code: rpcCodes.internal,
      message: getMessageFromCode(rpcCodes.internal),
      data: { originalError: invalidError0 },
    });
  });

  it("invalid error: null", () => {
    const result = serializeError(invalidError5);
    expect(result).toStrictEqual({
      code: rpcCodes.internal,
      message: getMessageFromCode(rpcCodes.internal),
      data: { originalError: invalidError5 },
    });
  });

  it("invalid error: undefined", () => {
    const result = serializeError(invalidError6);
    expect(result).toStrictEqual({
      code: rpcCodes.internal,
      message: getMessageFromCode(rpcCodes.internal),
      data: { originalError: invalidError6 },
    });
  });

  it("invalid error: array", () => {
    const result = serializeError(invalidError1);
    expect(result).toStrictEqual({
      code: rpcCodes.internal,
      message: getMessageFromCode(rpcCodes.internal),
      data: { originalError: invalidError1 },
    });
  });

  it("invalid error: invalid code", () => {
    const result = serializeError(invalidError2);
    expect(result).toStrictEqual({
      code: rpcCodes.internal,
      message: getMessageFromCode(rpcCodes.internal),
      data: { originalError: invalidError2 },
    });
  });

  it("invalid error: valid code, undefined message", () => {
    const result = serializeError(invalidError3);
    expect(result).toStrictEqual({
      code: 4001,
      message: getMessageFromCode(4001),
      data: { originalError: Object.assign({}, invalidError3) },
    });
  });

  it("invalid error: non-string message with data", () => {
    const result = serializeError(invalidError4);
    expect(result).toStrictEqual({
      code: 4001,
      message: getMessageFromCode(4001),
      data: { originalError: Object.assign({}, invalidError4) },
    });
  });

  it("invalid error: invalid code with string message", () => {
    const result = serializeError(invalidError7);
    expect(result).toStrictEqual({
      code: rpcCodes.internal,
      message: dummyMessage,
      data: { originalError: Object.assign({}, invalidError7) },
    });
  });

  it("invalid error: invalid code, no message, custom fallback", () => {
    const result = serializeError(invalidError2, {
      fallbackError: { code: rpcCodes.methodNotFound, message: "foo" },
    });
    expect(result).toStrictEqual({
      code: rpcCodes.methodNotFound,
      message: "foo",
      data: { originalError: Object.assign({}, invalidError2) },
    });
  });

  it("valid error: code and message only", () => {
    const result = serializeError(validError0);
    expect(result).toStrictEqual({
      code: 4001,
      message: validError0.message,
    });
  });

  it("valid error: code, message, and data", () => {
    const result = serializeError(validError1);
    expect(result).toStrictEqual({
      code: 4001,
      message: validError1.message,
      data: Object.assign({}, validError1.data),
    });
  });

  it("valid error: instantiated error", () => {
    const result = serializeError(validError2);
    expect(result).toStrictEqual({
      code: rpcCodes.parse,
      message: getMessageFromCode(rpcCodes.parse),
    });
  });

  it("valid error: instantiated error", () => {
    const result = serializeError(validError3);
    expect(result).toStrictEqual({
      code: rpcCodes.parse,
      message: dummyMessage,
    });
  });

  it("valid error: instantiated error with custom message and data", () => {
    const result = serializeError(validError4);
    expect(result).toStrictEqual({
      code: rpcCodes.parse,
      message: validError4.message,
      data: Object.assign({}, validError4.data),
    });
  });

  it("valid error: message, data, and stack", () => {
    const result = serializeError(
      Object.assign({}, validError1, { stack: "foo" })
    );
    expect(result).toStrictEqual({
      code: 4001,
      message: validError1.message,
      data: Object.assign({}, validError1.data),
    });
  });

  it("include stack: no stack present", () => {
    const result = serializeError(validError1, { shouldIncludeStack: true });
    expect(result).toStrictEqual({
      code: 4001,
      message: validError1.message,
      data: Object.assign({}, validError1.data),
    });
  });

  it("include stack: string stack present", () => {
    const result = serializeError(
      Object.assign({}, validError1, { stack: "foo" }),
      { shouldIncludeStack: true }
    );
    expect(result).toStrictEqual({
      code: 4001,
      message: validError1.message,
      data: Object.assign({}, validError1.data),
      stack: "foo",
    });
  });

  it("include stack: non-string stack present", () => {
    const result = serializeError(
      Object.assign({}, validError1, { stack: 2 }),
      {
        shouldIncludeStack: true,
      }
    );
    expect(result).toStrictEqual({
      code: 4001,
      message: validError1.message,
      data: Object.assign({}, validError1.data),
    });
  });
});
