import { ethErrors } from "..";

export const dummyData = { foo: 'bar' };
export const dummyMessage = 'baz';

export const invalidError0 = 0;
export const invalidError1 = ['foo', 'bar', 3];
export const invalidError2 = { code: 34 };
export const invalidError3 = { code: 4001 };
export const invalidError4 = {
  code: 4001,
  message: 3,
  data: Object.assign({}, dummyData),
};
export const invalidError5 = null;
export const invalidError6 = undefined;
export const invalidError7 = {
  code: 34,
  message: dummyMessage,
  data: Object.assign({}, dummyData),
};

export const validError0 = { code: 4001, message: dummyMessage };
export const validError1 = {
  code: 4001,
  message: dummyMessage,
  data: Object.assign({}, dummyData),
};
export const validError2 = ethErrors.rpc.parse();
delete validError2.stack;
export const validError3 = ethErrors.rpc.parse(dummyMessage);
delete validError3.stack;
export const validError4 = ethErrors.rpc.parse({
  message: dummyMessage,
  data: Object.assign({}, dummyData),
});
delete validError4.stack;
