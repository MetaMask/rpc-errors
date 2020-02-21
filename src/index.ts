import { EthereumRpcError, EthereumProviderError } from './classes';
import { serializeError, getMessageFromCode } from './utils';
import ethErrors from './errors';

import ERROR_CODES from './errorCodes';

export default {
  ethErrors,
  EthereumRpcError,
  EthereumProviderError,
  serializeError,
  getMessageFromCode,
  ERROR_CODES,
};
