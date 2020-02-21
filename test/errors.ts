import test, { Test } from 'tape';
import dequal from 'fast-deep-equal';
import ethJsonRpcErrors from '../src';
import { getMessageFromCode, JSON_RPC_SERVER_ERROR_MESSAGE as serverErrorMessage } from '../src/utils';

const {
  ethErrors, EthereumRpcError, EthereumProviderError, ERROR_CODES,
} = ethJsonRpcErrors;

const rpcCodes = ERROR_CODES.rpc;
const providerCodes = ERROR_CODES.provider;

const rpcCodeValues = Object.values(rpcCodes);

const dummyData = { foo: 'bar' };

const SERVER_ERROR_CODE = -32098;
const CUSTOM_ERROR_CODE = 1001;
const CUSTOM_ERROR_MESSAGE = 'foo';

test('ensure exported object accepts a single string argument where appropriate', (t) => {
  let err = ethErrors.rpc.invalidInput(CUSTOM_ERROR_MESSAGE);
  t.ok(err.code === ERROR_CODES.rpc.invalidInput, 'code is as expected');
  t.ok(err.message === CUSTOM_ERROR_MESSAGE, 'message is as expected');

  err = ethErrors.provider.unauthorized(CUSTOM_ERROR_MESSAGE);
  t.ok(err.code === ERROR_CODES.provider.unauthorized, 'code is as expected');
  t.ok(err.message === CUSTOM_ERROR_MESSAGE, 'message is as expected');
  t.end();
});

test('custom provider error options', (t) => {
  t.throws(
    () => {
      // TODO - delete this test?
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ethErrors.provider.custom('bar');
    },
    /Ethereum Provider custom errors must/u,
    'does not accept non-object argument'
  );

  t.throws(
    () => {
      // TODO - delete this test?
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ethErrors.provider.custom({ code: 4009, message: 2 });
    },
    /"message" must be/u,
    'does not accept nonstring message'
  );

  t.throws(
    () => {
      ethErrors.provider.custom({ code: 4009, message: '' });
    },
    /"message" must be/u,
    'does not accept empty message'
  );

  const err = ethErrors.provider.custom({ code: 4009, message: 'foo' });
  t.ok(err instanceof EthereumProviderError);
  t.end();
});

test('server rpc error options', (t) => {
  t.throws(
    () => {
      ethErrors.rpc.server('bar');
    },
    /Ethereum RPC Server errors must/u,
    'does not accept non-object argument'
  );

  t.throws(
    () => {
      // TODO - delete this test?
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ethErrors.rpc.server({ code: 'bar' });
    },
    /"code" must be/u,
    'does not accept non-string code'
  );

  t.throws(
    () => {
      ethErrors.rpc.server({ code: 1 });
    },
    /"code" must be/u,
    'does not accept out-of-range code'
  );

  const err = ethErrors.rpc.server({ code: -32006, message: 'foo' });
  t.ok(err instanceof EthereumRpcError);
  t.end();
});

// we just iterate over all keys on the errors object and call and check
// each error in turn
test('test exported object for correctness', (t) => {
  t.comment('Begin: Ethereum RPC');
  Object.keys(ethErrors.rpc).forEach((k) => {
    if (k === 'server') {
      validateError(
        ethErrors.rpc[k]({
          code: SERVER_ERROR_CODE,
          message: undefined,
          data: { ...dummyData },
        }),
        k, dummyData, t
      );
    } else {
      validateError(
        (ethErrors.rpc as any)[k]({
          message: null,
          data: { ...dummyData },
        }),
        k, dummyData, t
      );
    }
  });
  t.comment('End: Ethereum RPC');

  t.comment('Begin: Ethereum Provider');
  Object.keys(ethErrors.provider).forEach((k) => {
    if (k === 'custom') {
      validateError(
        ethErrors.provider[k]({
          code: CUSTOM_ERROR_CODE,
          message: CUSTOM_ERROR_MESSAGE,
          data: { ...dummyData },
        }),
        k, dummyData, t, true
      );
    } else {
      validateError(
        (ethErrors.provider as any)[k]({
          message: null,
          data: { ...dummyData },
        }),
        k, dummyData, t, true
      );
    }
  });
  t.comment('End: Ethereum Provider');
  t.end();
});

function validateError (err: any, key: any, data: any, t: Test, isProvider = false) {
  t.comment(`testing: ${key}`);
  t.ok(

    err instanceof Error &&
      err instanceof EthereumRpcError &&
      isProvider ? err instanceof EthereumProviderError : true
    ,
    'error has correct inheritance'
  );
  t.ok(Number.isInteger(err.code), 'code is an integer');
  t.ok(err.message && typeof err.message === 'string', 'message is a string');
  t.ok(dequal(err.data, data), 'data is as provided');

  if (err instanceof EthereumProviderError) {
    t.ok(err.code >= 1000 && err.code < 5000, 'code has valid value');

    if (key === 'custom') {
      t.ok(
        err.code === CUSTOM_ERROR_CODE &&
        err.message === CUSTOM_ERROR_MESSAGE,
        'code and message values correspond for error type'
      );
    } else {
      t.ok(
        err.code === (providerCodes as any)[key] &&
        err.message === getMessageFromCode((providerCodes as any)[key]),
        'code and message values correspond for error type'
      );
    }
  } else if (err instanceof EthereumRpcError) {

    t.ok(
      rpcCodeValues.includes((err as any).code) || (err.code <= -32000 && err.code >= -32099),
      'code has valid value'
    );

    if (key === 'server') {
      t.ok(
        err.code <= -32000 && err.code >= -32099 && err.message === serverErrorMessage,
        'code and message values correspond for error type'
      );
    } else {
      t.ok(
        err.code === (rpcCodes as any)[key] && err.message === getMessageFromCode((rpcCodes as any)[key]),
        'code and message values correspond for error type'
      );
    }
  }
}
