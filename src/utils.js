
const errorValues = require('./errorValues.json')

const JSONRPC_SERVER_ERROR_MESSAGE = 'Unspecified server error.'
const DEFAULT_MESSAGE = 'Unspecified error message. This is a bug, please report it.'

function getMessageFromCode(code, defaultMessage) {

  if (Number.isInteger(code)) {

    const codeString = code.toString()
    if (errorValues[codeString]) return errorValues[codeString].message

    // JSON RPC 2.0 Server Error
    if ((code >= -32099 && code <= -32000)) return JSONRPC_SERVER_ERROR_MESSAGE
  }
  return defaultMessage || DEFAULT_MESSAGE
}

function isValidCode(code) {

  if (!Number.isInteger(code)) return false

  const codeString = code.toString()
  if (errorValues[codeString]) return true

  // JSON RPC 2.0 Server Error
  if ((code >= -32099 && code <= -32000)) return true

  // EIP 1193 Status Codes
  if (code >= 1000 && code <= 4999) return true

  return false
}

module.exports = {
  getMessageFromCode,
  isValidCode,
  JSONRPC_SERVER_ERROR_MESSAGE,
}
