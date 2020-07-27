
const test = require('tape')
const dequal = require('fast-deep-equal')

const { ethErrors, serializeError, ERROR_CODES } = require('..')
const { getMessageFromCode } = require('../src/utils')

const rpcCodes = ERROR_CODES.rpc

const dummyData = { foo: 'bar' }
const dummyMessage = 'baz'

const invalidError0 = 0
const invalidError1 = ['foo', 'bar', 3]
const invalidError2 = { code: 34 }
const invalidError3 = { code: 4001 }
const invalidError4 = { code: 4001, message: 3, data: { ...dummyData } }
const invalidError5 = null
const invalidError6 = undefined
const invalidError7 = { code: 34, message: dummyMessage, data: { ...dummyData } }

const validError0 = { code: 4001, message: dummyMessage }
const validError1 = { code: 4001, message: dummyMessage, data: { ...dummyData } }
const validError2 = ethErrors.rpc.parse()
delete validError2.stack
const validError3 = ethErrors.rpc.parse(dummyMessage)
delete validError3.stack
const validError4 = ethErrors.rpc.parse({
  message: dummyMessage,
  data: { ...dummyData },
})
delete validError4.stack

test('invalid error: non-object', (t) => {
  const result = serializeError(invalidError0)
  t.ok(
    dequal(
      result,
      {
        code: rpcCodes.internal,
        message: getMessageFromCode(rpcCodes.internal),
        data: { originalError: invalidError0 },
      },
    ),
    'serialized error matches expected result',
  )
  t.end()
})

test('invalid error: null', (t) => {
  const result = serializeError(invalidError5)
  t.ok(
    dequal(
      result,
      {
        code: rpcCodes.internal,
        message: getMessageFromCode(rpcCodes.internal),
        data: { originalError: invalidError5 },
      },
    ),
    'serialized error matches expected result',
  )
  t.end()
})

test('invalid error: undefined', (t) => {
  const result = serializeError(invalidError6)
  t.ok(
    dequal(
      result,
      {
        code: rpcCodes.internal,
        message: getMessageFromCode(rpcCodes.internal),
        data: { originalError: invalidError6 },
      },
    ),
    'serialized error matches expected result',
  )
  t.end()
})

test('invalid error: array', (t) => {
  const result = serializeError(invalidError1)
  t.ok(
    dequal(
      result,
      {
        code: rpcCodes.internal,
        message: getMessageFromCode(rpcCodes.internal),
        data: { originalError: invalidError1 },
      },
    ),
    'serialized error matches expected result',
  )
  t.end()
})

test('invalid error: invalid code', (t) => {
  const result = serializeError(invalidError2)
  t.ok(
    dequal(
      result,
      {
        code: rpcCodes.internal,
        message: getMessageFromCode(rpcCodes.internal),
        data: { originalError: { ...invalidError2 } },
      },
    ),
    'serialized error matches expected result',
  )
  t.end()
})

test('invalid error: valid code, undefined message', (t) => {
  const result = serializeError(invalidError3)
  t.ok(
    dequal(
      result,
      {
        code: 4001,
        message: getMessageFromCode(4001),
        data: { originalError: { ...invalidError3 } },
      },
    ),
    'serialized error matches expected result',
  )
  t.end()
})

test('invalid error: non-string message with data', (t) => {
  const result = serializeError(invalidError4)
  t.ok(
    dequal(
      result,
      {
        code: 4001,
        message: getMessageFromCode(4001),
        data: { originalError: { ...invalidError4 } },
      },
    ),
    'serialized error matches expected result',
  )
  t.end()
})

test('invalid error: invalid code with string message', (t) => {
  const result = serializeError(invalidError7)
  t.ok(
    dequal(
      result,
      {
        code: rpcCodes.internal,
        message: dummyMessage,
        data: { originalError: { ...invalidError7 } },
      },
    ),
    'serialized error matches expected result',
  )
  t.end()
})

test('invalid error: invalid code, no message, custom fallback', (t) => {
  const result = serializeError(
    invalidError2,
    { fallbackError: { code: rpcCodes.methodNotFound, message: 'foo' } },
  )
  t.ok(
    dequal(
      result,
      {
        code: rpcCodes.methodNotFound,
        message: 'foo',
        data: { originalError: { ...invalidError2 } },
      },
    ),
    'serialized error matches expected result',
  )
  t.end()
})

test('valid error: code and message only', (t) => {
  const result = serializeError(validError0)
  t.ok(
    dequal(
      result,
      {
        code: 4001,
        message: validError0.message,
      },
    ),
    'serialized error matches expected result',
  )
  t.end()
})

test('valid error: code, message, and data', (t) => {
  const result = serializeError(validError1)
  t.ok(
    dequal(
      result,
      {
        code: 4001,
        message: validError1.message,
        data: { ...validError1.data },
      },
    ),
    'serialized error matches expected result',
  )
  t.end()
})

test('valid error: instantiated error', (t) => {
  const result = serializeError(validError2)
  t.ok(
    dequal(
      result,
      {
        code: rpcCodes.parse,
        message: getMessageFromCode(rpcCodes.parse),
      },
    ),
    'serialized error matches expected result',
  )
  t.end()
})

test('valid error: instantiated error', (t) => {
  const result = serializeError(validError3)
  t.ok(
    dequal(
      result,
      {
        code: rpcCodes.parse,
        message: dummyMessage,
      },
    ),
    'serialized error matches expected result',
  )
  t.end()
})

test('valid error: instantiated error with custom message and data', (t) => {
  const result = serializeError(validError4)
  t.ok(
    dequal(
      result,
      {
        code: rpcCodes.parse,
        message: validError4.message,
        data: { ...validError4.data },
      },
    ),
    'serialized error matches expected result',
  )
  t.end()
})

test('valid error: message, data, and stack', (t) => {
  const result = serializeError({ ...validError1, stack: 'foo' })
  t.ok(
    dequal(
      result,
      {
        code: 4001,
        message: validError1.message,
        data: { ...validError1.data },
      },
    ),
    'serialized error matches expected result',
  )
  t.end()
})

test('include stack: no stack present', (t) => {
  const result = serializeError(
    validError1,
    { shouldIncludeStack: true },
  )
  t.ok(
    dequal(
      result,
      {
        code: 4001,
        message: validError1.message,
        data: { ...validError1.data },
      },
    ),
    'serialized error matches expected result',
  )
  t.end()
})

test('include stack: string stack present', (t) => {
  const result = serializeError(
    { ...validError1, stack: 'foo' },
    { shouldIncludeStack: true },
  )
  t.ok(
    dequal(
      result,
      {
        code: 4001,
        message: validError1.message,
        data: { ...validError1.data },
        stack: 'foo',
      },
    ),
    'serialized error matches expected result',
  )
  t.end()
})

test('include stack: non-string stack present', (t) => {
  const result = serializeError(
    { ...validError1, stack: 2 },
    { shouldIncludeStack: true },
  )
  t.ok(
    dequal(
      result,
      {
        code: 4001,
        message: validError1.message,
        data: { ...validError1.data },
      },
    ),
    'serialized error matches expected result',
  )
  t.end()
})
