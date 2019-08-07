
const test = require('tape')
const dequal = require('fast-deep-equal')

const imports = require('../')
const serializeError = imports.serializeError
const getMessageFromCode = imports.getMessageFromCode
const errors = imports.rpcErrors

const jsonRpcErrorValues = require('../src/JsonRpcError').errorValues

const dummyData = { foo: 'bar' }
const dummyMessage = 'baz'

const invalidError0 = 0
const invalidError1 = ['foo', 'bar', 3]
const invalidError2 = { code: 34 }
const invalidError3 = { code: 4001 }
const invalidError4 = { code: 4001, message: 3, data: { ...dummyData } }

const validError0 = { code: 4001, message: dummyMessage }
const validError1 = { code: 4001, message: dummyMessage, data: { ...dummyData } }
const validError2 = errors.parse()
const validError3 = errors.parse(dummyMessage, { ...dummyData })

test('invalid error: non-object', t => {
  const result = serializeError(invalidError0)
  t.ok(
    dequal(
      result,
      {
        code: jsonRpcErrorValues.internal.code,
        message: jsonRpcErrorValues.internal.message,
        data: { originalError: invalidError0 }
      }
    ),
    'serialized error matches expected result'
  )
  t.end()
})

test('invalid error: array', t => {
  const result = serializeError(invalidError1)
  t.ok(
    dequal(
      result,
      {
        code: jsonRpcErrorValues.internal.code,
        message: jsonRpcErrorValues.internal.message,
        data: { originalError: invalidError1 }
      }
    ),
    'serialized error matches expected result'
  )
  t.end()
})

test('invalid error: invalid code', t => {
  const result = serializeError(invalidError2)
  t.ok(
    dequal(
      result,
      {
        code: jsonRpcErrorValues.internal.code,
        message: jsonRpcErrorValues.internal.message,
        data: { originalError: { ...invalidError2 } }
      }
    ),
    'serialized error matches expected result'
  )
  t.end()
})

test('invalid error: valid code, undefined message', t => {
  const result = serializeError(invalidError3)
  t.ok(
    dequal(
      result,
      {
        code: 4001,
        message: getMessageFromCode(4001),
        data: { originalError: { ...invalidError3 } }
      }
    ),
    'serialized error matches expected result'
  )
  t.end()
})

test('invalid error: non-string message with data', t => {
  const result = serializeError(invalidError4)
  t.ok(
    dequal(
      result,
      {
        code: 4001,
        message: getMessageFromCode(4001),
        data: { originalError: { ...invalidError4 } }
      }
    ),
    'serialized error matches expected result'
  )
  t.end()
})

test('valid error: code and message only', t => {
  const result = serializeError(validError0)
  t.ok(
    dequal(
      result,
      {
        code: 4001,
        message: validError0.message,
      }
    ),
    'serialized error matches expected result'
  )
  t.end()
})

test('valid error: code, message, and data', t => {
  const result = serializeError(validError1)
  t.ok(
    dequal(
      result,
      {
        code: 4001,
        message: validError1.message,
        data: { ...validError1.data },
      }
    ),
    'serialized error matches expected result'
  )
  t.end()
})

test('valid error: instantiated error', t => {
  const result = serializeError(validError2)
  t.ok(
    dequal(
      result,
      {
        code: jsonRpcErrorValues.parse.code,
        message: jsonRpcErrorValues.parse.message,
        stack: validError2.stack,
      }
    ),
    'serialized error matches expected result'
  )
  t.end()
})

test('valid error: instantiated error with custom message and data', t => {
  const result = serializeError(validError3)
  t.ok(
    dequal(
      result,
      {
        code: jsonRpcErrorValues.parse.code,
        message: validError3.message,
        data: { ...validError3.data },
        stack: validError3.stack,
      }
    ),
    'serialized error matches expected result'
  )
  t.end()
})
