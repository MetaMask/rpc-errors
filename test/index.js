
const test = require('tape')
const dequal = require('fast-deep-equal')

const imports = require('../')
const errors = imports.default
const JsonRpcError = imports.JsonRpcError
const EthJsonRpcError = imports.EthJsonRpcError
const jsonRpcErrorValues = imports.JSON_RPC_ERROR_VALUES
const ethJsonRpcErrorValues = imports.ETH_JSON_RPC_ERROR_VALUES

const jsonRpcCodes = [-32700, -32600, -32601, -32602, -32603]

const dummyData = { foo: 'bar' }

// we just iterate over all keys on the default export and call and check
// each error in turn
test('test exported object for correctness', t => {

  t.comment('Begin: JSON RPC 2.0')
  Object.keys(errors).forEach(k => {
    if (k !== 'eth') {
      if (k === 'server') {
        validateError(t, errors[k](-32098, null, { ...dummyData }), k, dummyData)
      } else validateError(t, errors[k](null, { ...dummyData }), k, dummyData)
    }
  })
  t.comment('End: JSON RPC 2.0')

  t.comment('Begin: ETH JSON RPC')
  Object.keys(errors.eth).forEach(k => {
    validateError(t, errors.eth[k](null, { ...dummyData }), k, dummyData)
  })
  t.comment('End: ETH JSON RPC')
  t.end()
})

function validateError(t, err, key, data) {

  t.comment(`testing: ${key}`)
  t.ok(Number.isInteger(err.code))
  t.ok(typeof err.message === 'string')
  t.ok(err.data === undefined || dequal(err.data, data))

  if (err instanceof EthJsonRpcError) {
    t.ok(err.code >= 1000 && err.code < 5000)
    t.ok(
      err.code === ethJsonRpcErrorValues[key].code &&
      err.message === ethJsonRpcErrorValues[key].message
    )
  }
  else if (err instanceof JsonRpcError) {
    t.ok(jsonRpcCodes.includes(err.code) || err.code <= -32000 && err.code >= -32099)
    if (key !== 'server') {
      t.ok(
        err.code === jsonRpcErrorValues[key].code &&
        err.message === jsonRpcErrorValues[key].message
      )
    }
  }
}
