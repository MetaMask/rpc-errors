"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tape_1 = __importDefault(require("tape"));
const fast_deep_equal_1 = __importDefault(require("fast-deep-equal"));
const src_1 = __importDefault(require("../src"));
const utils_1 = require("../src/utils");
const { ethErrors, serializeError, ERROR_CODES } = src_1.default;
const rpcCodes = ERROR_CODES.rpc;
const dummyData = { foo: 'bar' };
const dummyMessage = 'baz';
const invalidError0 = 0;
const invalidError1 = ['foo', 'bar', 3];
const invalidError2 = { code: 34 };
const invalidError3 = { code: 4001 };
const invalidError4 = { code: 4001, message: 3, data: Object.assign({}, dummyData) };
const invalidError5 = null;
const invalidError6 = undefined;
const invalidError7 = { code: 34, message: dummyMessage, data: Object.assign({}, dummyData) };
const validError0 = { code: 4001, message: dummyMessage };
const validError1 = { code: 4001, message: dummyMessage, data: Object.assign({}, dummyData) };
const validError2 = ethErrors.rpc.parse();
const validError3 = ethErrors.rpc.parse(dummyMessage);
const validError4 = ethErrors.rpc.parse({
    message: dummyMessage,
    data: Object.assign({}, dummyData),
});
tape_1.default('invalid error: non-object', (t) => {
    const result = serializeError(invalidError0);
    t.ok(fast_deep_equal_1.default(result, {
        code: rpcCodes.internal,
        message: utils_1.getMessageFromCode(rpcCodes.internal),
        data: { originalError: invalidError0 },
    }), 'serialized error matches expected result');
    t.end();
});
tape_1.default('invalid error: null', (t) => {
    const result = serializeError(invalidError5);
    t.ok(fast_deep_equal_1.default(result, {
        code: rpcCodes.internal,
        message: utils_1.getMessageFromCode(rpcCodes.internal),
        data: { originalError: invalidError5 },
    }), 'serialized error matches expected result');
    t.end();
});
tape_1.default('invalid error: undefined', (t) => {
    const result = serializeError(invalidError6);
    t.ok(fast_deep_equal_1.default(result, {
        code: rpcCodes.internal,
        message: utils_1.getMessageFromCode(rpcCodes.internal),
        data: { originalError: invalidError6 },
    }), 'serialized error matches expected result');
    t.end();
});
tape_1.default('invalid error: array', (t) => {
    const result = serializeError(invalidError1);
    t.ok(fast_deep_equal_1.default(result, {
        code: rpcCodes.internal,
        message: utils_1.getMessageFromCode(rpcCodes.internal),
        data: { originalError: invalidError1 },
    }), 'serialized error matches expected result');
    t.end();
});
tape_1.default('invalid error: invalid code', (t) => {
    const result = serializeError(invalidError2);
    t.ok(fast_deep_equal_1.default(result, {
        code: rpcCodes.internal,
        message: utils_1.getMessageFromCode(rpcCodes.internal),
        data: { originalError: Object.assign({}, invalidError2) },
    }), 'serialized error matches expected result');
    t.end();
});
tape_1.default('invalid error: valid code, undefined message', (t) => {
    const result = serializeError(invalidError3);
    t.ok(fast_deep_equal_1.default(result, {
        code: 4001,
        message: utils_1.getMessageFromCode(4001),
        data: { originalError: Object.assign({}, invalidError3) },
    }), 'serialized error matches expected result');
    t.end();
});
tape_1.default('invalid error: non-string message with data', (t) => {
    const result = serializeError(invalidError4);
    t.ok(fast_deep_equal_1.default(result, {
        code: 4001,
        message: utils_1.getMessageFromCode(4001),
        data: { originalError: Object.assign({}, invalidError4) },
    }), 'serialized error matches expected result');
    t.end();
});
tape_1.default('invalid error: invalid code with string message', (t) => {
    const result = serializeError(invalidError7);
    t.ok(fast_deep_equal_1.default(result, {
        code: rpcCodes.internal,
        message: dummyMessage,
        data: { originalError: Object.assign({}, invalidError7) },
    }), 'serialized error matches expected result');
    t.end();
});
tape_1.default('valid error: code and message only', (t) => {
    const result = serializeError(validError0);
    t.ok(fast_deep_equal_1.default(result, {
        code: 4001,
        message: validError0.message,
    }), 'serialized error matches expected result');
    t.end();
});
tape_1.default('valid error: code, message, and data', (t) => {
    const result = serializeError(validError1);
    t.ok(fast_deep_equal_1.default(result, {
        code: 4001,
        message: validError1.message,
        data: Object.assign({}, validError1.data),
    }), 'serialized error matches expected result');
    t.end();
});
tape_1.default('valid error: instantiated error', (t) => {
    const result = serializeError(validError2);
    t.ok(fast_deep_equal_1.default(result, {
        code: rpcCodes.parse,
        message: utils_1.getMessageFromCode(rpcCodes.parse),
        stack: validError2.stack,
    }), 'serialized error matches expected result');
    t.end();
});
tape_1.default('valid error: instantiated error', (t) => {
    const result = serializeError(validError3);
    t.ok(fast_deep_equal_1.default(result, {
        code: rpcCodes.parse,
        message: dummyMessage,
        stack: validError3.stack,
    }), 'serialized error matches expected result');
    t.end();
});
tape_1.default('valid error: instantiated error with custom message and data', (t) => {
    const result = serializeError(validError4);
    t.ok(fast_deep_equal_1.default(result, {
        code: rpcCodes.parse,
        message: validError4.message,
        data: Object.assign({}, validError4.data),
        stack: validError4.stack,
    }), 'serialized error matches expected result');
    t.end();
});
//# sourceMappingURL=serializeError.js.map