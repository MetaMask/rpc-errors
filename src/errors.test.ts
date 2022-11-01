import { getMessageFromCode, JSON_RPC_SERVER_ERROR_MESSAGE } from "./utils";
import {
  ethErrors,
  EthereumRpcError,
  EthereumProviderError,
  errorCodes,
} from ".";

const rpcCodes = errorCodes.rpc;
const providerCodes = errorCodes.provider;
const serverErrorMessage = JSON_RPC_SERVER_ERROR_MESSAGE;

const rpcCodeValues = Object.values(rpcCodes);

const dummyData = { foo: "bar" };

const SERVER_ERROR_CODE = -32098;
const CUSTOM_ERROR_CODE = 1001;
const CUSTOM_ERROR_MESSAGE = "foo";

test("ensure exported object accepts a single string argument where appropriate", () => {
  let err = ethErrors.rpc.invalidInput(CUSTOM_ERROR_MESSAGE);
  expect(err.code === errorCodes.rpc.invalidInput).toBeTruthy();
  expect(err.message === CUSTOM_ERROR_MESSAGE).toBeTruthy();

  err = ethErrors.provider.unauthorized(CUSTOM_ERROR_MESSAGE);
  expect(err.code === errorCodes.provider.unauthorized).toBeTruthy();
  expect(err.message === CUSTOM_ERROR_MESSAGE).toBeTruthy();
});

test("custom provider error options", () => {
  expect(() => {
    ethErrors.provider.custom("bar" as any);
  }).toThrowError(/Ethereum Provider custom errors must/u);

  expect(() => {
    ethErrors.provider.custom({ code: 4009, message: 2 } as any);
  }).toThrowError(/"message" must be/u);

  expect(() => {
    ethErrors.provider.custom({ code: 4009, message: "" });
  }).toThrowError(/"message" must be/u);

  const err = ethErrors.provider.custom({ code: 4009, message: "foo" });
  expect(err instanceof EthereumProviderError).toBeTruthy();
});

test("server rpc error options", () => {
  expect(() => {
    ethErrors.rpc.server("bar" as any);
  }).toThrowError(/Ethereum RPC Server errors must/u);

  expect(() => {
    ethErrors.rpc.server({ code: "bar" } as any);
  }).toThrowError(/"code" must be/u);

  expect(() => {
    ethErrors.rpc.server({ code: 1 });
  }).toThrowError(/"code" must be/u);

  const err = ethErrors.rpc.server({ code: -32006, message: "foo" });
  expect(err instanceof EthereumRpcError).toBeTruthy();
});

// we just iterate over all keys on the errors object and call and check
// each error in turn
describe("test exported object for correctness", () => {
  it.each(Object.entries(ethErrors.rpc).filter(([key]) => key !== "server"))(
    "Ethereum RPC",
    (key, value) => {
      const createError = value as any;
      const error = createError({
        message: null,
        data: Object.assign({}, dummyData),
      });
      // @ts-expect-error Fix?
      const rpcCode = rpcCodes[key];
      expect(
        rpcCodeValues.includes(error.code) ||
          (error.code <= -32000 && error.code >= -32099)
      ).toBeTruthy();
      expect(error.code).toBe(rpcCode);
      expect(error.message).toBe(getMessageFromCode(rpcCode));
    }
  );

  it("server", () => {
    const error = ethErrors.rpc.server({
      code: SERVER_ERROR_CODE,
      message: undefined,
      data: Object.assign({}, dummyData),
    });
    expect(error.code <= -32000 && error.code >= -32099).toBeTruthy();
    expect(error.message).toBe(serverErrorMessage);
  });

  it.each(
    Object.entries(ethErrors.provider).filter(([key]) => key !== "custom")
  )("Ethereum Provider", (key, value) => {
    const createError = value as any;
    const error = createError({
      message: null,
      data: Object.assign({}, dummyData),
    });
    // @ts-expect-error Fix?
    const providerCode = providerCodes[key];
    expect(error.code >= 1000 && error.code < 5000).toBeTruthy();
    expect(error.code).toBe(providerCode);
    expect(error.message).toBe(getMessageFromCode(providerCode));
  });

  it("custom", () => {
    const error = ethErrors.provider.custom({
      code: CUSTOM_ERROR_CODE,
      message: CUSTOM_ERROR_MESSAGE,
      data: Object.assign({}, dummyData),
    });
    expect(error.code >= 1000 && error.code < 5000).toBeTruthy();
    expect(error.code).toBe(CUSTOM_ERROR_CODE);
    expect(error.message).toBe(CUSTOM_ERROR_MESSAGE);
  });
});
