import { SignedInAuthObject } from "@clerk/nextjs/api";
import { randomUUID } from "crypto";

const createSessionTrainer = (): Partial<SignedInAuthObject> => {
  return {
    sessionClaims: {
      azp: "http://localhost:3000",
      email: "trainer@trainer.com",
      exp: 1703586485,
      iat: 1703586425,
      iss: "https://funny-wildcat-64.clerk.accounts.dev",
      jti: "0d929d4e3d0163af2341",
      nbf: 1703586415,
      sid: "sess_2Zziy00ZyQuQrE4lyrDQFv1YWHs",
      sub: "user_2ZJMb3YCdXrw3EE7hNBPysiEcBC",
      __raw: "",
    },
    sessionId: "sess_2Zziy00ZyQuQrE4lyrDQFv1YWHs",
    userId: randomUUID(),
  };
};

export default createSessionTrainer() as SignedInAuthObject;
