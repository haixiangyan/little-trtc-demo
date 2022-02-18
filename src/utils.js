import LibGenerateTestUserSig from './lib/lib-generate-test-usersig.min.js';

const SDKAPPID = Number(process.env.REACT_APP_SDK_APP_ID);
const SECRETKEY = process.env.REACT_APP_SECRET_KEY;
const EXPIRETIME = 604800;

const generator = new LibGenerateTestUserSig(SDKAPPID, SECRETKEY, EXPIRETIME);

export const generateUserSign = (userId) => {
  const userSig = generator.genTestUserSig(userId);

  return {
    userSig,
    privateMapKey: 255,
  };
}
