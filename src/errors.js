"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("./classes");
const utils_1 = require("./utils");
const errorCodes_1 = __importDefault(require("./errorCodes"));
exports.default = {
    rpc: {
        /**
         * Get a JSON RPC 2.0 Parse (-32700) error.
         *
         * @param [opts] - Options object or error message string
         * @returns {EthereumProviderError} The error
         */
        parse: (opts) => getEthJsonRpcError(errorCodes_1.default.rpc.parse, opts),
        /**
         * Get a JSON RPC 2.0 Invalid Request (-32600) error.
         *
         * @param [opts] - Options object or error message string
         * @returns {EthereumProviderError} The error
         */
        invalidRequest: (opts) => getEthJsonRpcError(errorCodes_1.default.rpc.invalidRequest, opts),
        /**
         * Get a JSON RPC 2.0 Invalid Params (-32602) error.
         *
         * @param [opts] - Options object or error message string
         * @returns {EthereumProviderError} The error
         */
        invalidParams: (opts) => getEthJsonRpcError(errorCodes_1.default.rpc.invalidParams, opts),
        /**
         * Get a JSON RPC 2.0 Method Not Found (-32601) error.
         *
         * @param [opts] - Options object or error message string
         * @returns {EthereumProviderError} The error
         */
        methodNotFound: (opts) => getEthJsonRpcError(errorCodes_1.default.rpc.methodNotFound, opts),
        /**
         * Get a JSON RPC 2.0 Internal (-32603) error.
         *
         * @param [opts] - Options object or error message string
         * @returns {EthereumProviderError} The error
         */
        internal: (opts) => getEthJsonRpcError(errorCodes_1.default.rpc.internal, opts),
        /**
         * Get a JSON RPC 2.0 Server error.
         *
         * Permits integer error codes in the [ -32099 <= -32005 ] range.
         * Codes -32000 through -32004 are reserved by EIP 1474.
         *
         * @param opts - Options object
         * @returns The error
         */
        server: (opts) => {
            if (!opts || typeof opts !== 'object' || Array.isArray(opts)) {
                throw new Error('Ethereum RPC Server errors must provide single object argument.');
            }
            const { code } = opts;
            if (!code) {
                throw new Error('"code" must be a number');
            }
            if (!Number.isInteger(code) || code > -32005 || code < -32099) {
                throw new Error('"code" must be an integer such that: -32099 <= code <= -32005');
            }
            return getEthJsonRpcError(code, opts);
        },
        /**
         * Get an Ethereum JSON RPC Invalid Input (-32000) error.
         *
         * @param [opts] - Options object or error message string
         * @returns {EthereumProviderError} The error
         */
        invalidInput: (opts) => getEthJsonRpcError(errorCodes_1.default.rpc.invalidInput, opts),
        /**
         * Get an Ethereum JSON RPC Resource Not Found (-32001) error.
         *
         * @param [opts] - Options object or error message string
         * @returns {EthereumProviderError} The error
         */
        resourceNotFound: (opts) => getEthJsonRpcError(errorCodes_1.default.rpc.resourceNotFound, opts),
        /**
         * Get an Ethereum JSON RPC Resource Unavailable (-32002) error.
         *
         * @param [opts] - Options object or error message string
         * @returns {EthereumProviderError} The error
         */
        resourceUnavailable: (opts) => getEthJsonRpcError(errorCodes_1.default.rpc.resourceUnavailable, opts),
        /**
         * Get an Ethereum JSON RPC Transaction Rejected (-32003) error.
         *
         * @param [opts] - Options object or error message string
         * @returns {EthereumProviderError} The error
         */
        transactionRejected: (opts) => getEthJsonRpcError(errorCodes_1.default.rpc.transactionRejected, opts),
        /**
         * Get an Ethereum JSON RPC Method Not Supported (-32004) error.
         *
         * @param [opts] - Options object or error message string
         * @returns {EthereumProviderError} The error
         */
        methodNotSupported: (opts) => getEthJsonRpcError(errorCodes_1.default.rpc.methodNotSupported, opts),
    },
    provider: {
        /**
         * Get an Ethereum Provider User Rejected Request (4001) error.
         *
         * @param [opts] - Options object or error message string
         * @returns {EthereumProviderError} The error
         */
        userRejectedRequest: (opts) => {
            return getEthProviderError(errorCodes_1.default.provider.userRejectedRequest, opts);
        },
        /**
         * Get an Ethereum Provider Unauthorized (4100) error.
         *
         * @param [opts] - Options object or error message string
         * @returns {EthereumProviderError} The error
         */
        unauthorized: (opts) => {
            return getEthProviderError(errorCodes_1.default.provider.unauthorized, opts);
        },
        /**
         * Get an Ethereum Provider Unsupported Method (4200) error.
         *
         * @param [opts] - Options object or error message string
         * @returns {EthereumProviderError} The error
         */
        unsupportedMethod: (opts) => {
            return getEthProviderError(errorCodes_1.default.provider.unsupportedMethod, opts);
        },
        /**
         * Get a custom Ethereum Provider error.
         *
         * @param opts - Options object
         * @returns The error
         */
        custom: (opts) => {
            if (!opts || typeof opts !== 'object' || Array.isArray(opts)) {
                throw new Error('Ethereum Provider custom errors must provide single object argument.');
            }
            const { code, message, data } = opts;
            if (!code) {
                throw new Error('"code" must be a valid number');
            }
            if (typeof message !== 'string' || !message) {
                throw new Error('"message" must be a nonempty string');
            }
            return new classes_1.EthereumProviderError(code, message, data);
        },
    },
};
function getEthJsonRpcError(code, opts) {
    const [message, data] = validateOpts(opts);
    return new classes_1.EthereumRpcError(code, message || utils_1.getMessageFromCode(code), data);
}
function getEthProviderError(code, opts) {
    const [message, data] = validateOpts(opts);
    return new classes_1.EthereumProviderError(code, message || utils_1.getMessageFromCode(code), data);
}
function validateOpts(opts) {
    let message, data;
    if (opts) {
        if (typeof opts === 'string') {
            message = opts;
        }
        else if (typeof opts === 'object' && !Array.isArray(opts)) {
            return [opts.message, opts.data];
        }
    }
    return [message, data];
}
//# sourceMappingURL=errors.js.map