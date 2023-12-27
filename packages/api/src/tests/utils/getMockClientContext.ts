import { SignedInAuthObject } from "@clerk/nextjs/api";
import { randomUUID } from "crypto";

const generateRandomEmail = () => {
  const uuid = randomUUID();
  return `client+${uuid}@client.com`;
};

const createSessionClient = (): Partial<SignedInAuthObject> => {
  return {
    sessionClaims: {
      azp: "http://localhost:3000",
      email: "client@client.com",
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
    user: {
      emailAddresses: [
        {
          emailAddress: generateRandomEmail(),
          id: "eml_2ZJMb3YCdXrw3EE7hNBPysiEcBC",
          linkedTo: [],
          verification: null,
        },
      ],
      firstName: "Client",
      backupCodeEnabled: false,
      banned: false,
      birthday: new Date("1990-01-01T00:00:00.000Z").toISOString(),
      createdAt: new Date("2021-06-25T16:40:25.000Z").getTime(),
      id: "user_2ZJMb3YCdXrw3EE7hNBPysiEcBC",
      lastName: "Test",
      externalAccounts: [],
      externalId: null,
      gender: "",
      lastSignInAt: new Date("2021-06-25T16:40:25.000Z").getTime(),
      passwordEnabled: true,
      phoneNumbers: [],
      primaryEmailAddressId: "eml_2ZJMb3YCdXrw3EE7hNBPysiEcBC",
      primaryPhoneNumberId: null,
      profileImageUrl: "",
      primaryWeb3WalletId: null,
      privateMetadata: {},
      publicMetadata: {},
      totpEnabled: false,
      twoFactorEnabled: false,
      unsafeMetadata: {},
      updatedAt: new Date("2021-06-25T16:40:25.000Z").getTime(),
      username: "client",
      web3Wallets: [],
    },
  };
};

export default createSessionClient() as SignedInAuthObject;
