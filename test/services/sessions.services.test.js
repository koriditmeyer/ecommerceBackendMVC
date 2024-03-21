import { SessionsServices } from "../../src/services/sessions.services.js";
import { faker } from "@faker-js/faker";
import { hash } from "../../src/utils/hash.js";

const mockUser = {
  email: "correctEmail",
  password: hash("correctPassword"),
};

const mockUsers = [];
for (let i = 0; i < 100; i++) {
  mockUsers.push({
    email: faker.internet.email(),
  });
}

const usersDaoMock = {
  create: async ({ email }) => {
    if (email === "AlreadyExist") {
      return Promise.reject(new Error("DUPLICATE"));
    }
    return mockUser;
  },
  findOne: async ({ email }) => {
    if (email === "correctEmail") {
      return mockUser;
    }
    return Promise.reject(new Error("NOT FOUND"));
  },
  readMany: async ({}) => {
    return mockUsers;
  },
};

const sessionsServices = new SessionsServices(usersDaoMock);

async function testRegisterWithoutUserNameFail() {
  const credentials = {
    email: "",
    password: "correctPassword",
  };

  let errorMessage;

  try {
    await sessionsServices.register(credentials,"local");
    throw new Error("❌ deberia haber lanzado un error pero no lo lanzó");
  } catch (error) {
    errorMessage = error.message;
  }

  if (errorMessage === "Authentication Error - Please Check your credentials") {
    console.log("👍 testRegisterWithoutUserNameFail")
  } else {
    console.log(
      "❌ el error no es el esperado. se lanzó el siguiente error: " + errorMessage
    );
  }
}

async function testRegisterWithoutPasswordFail() {
  const credentials = {
    email: "correctEmail",
    password: "",
  };

  let errorMessage;
describe("api",()=>{})
  try {
    await sessionsServices.register(credentials,"local");
    throw new Error("❌ deberia haber lanzado un error pero no lo lanzó");
  } catch (error) {
    errorMessage = error.message;
  }

  if (errorMessage === "Authentication Error - Please Check your credentials") {
    console.log("👍 testRegisterWithoutPasswordFail")
  } else {
    console.log(
      "❌ el error no es el esperado. se lanzó el siguiente error: " + errorMessage
    );
  }
}

async function testRegisterWithDuplicatedEmailFail() {
  const credentials = {
    email: "AlreadyExist",
    password: "correctPassword",
  };

  let errorMessage;

  try {
    await sessionsServices.register(credentials,"local");
    throw new Error("❌ deberia haber lanzado un error pero no lo lanzó");
  } catch (error) {
    errorMessage = error.message;
  }

  if (errorMessage === "DUPLICATE") {
    console.log("👍 testRegisterWithDuplicatedEmailFail")
  } else {
    console.log(
      "❌ el error no es el esperado. se lanzó el siguiente error: " + errorMessage
    );
  }
}

async function testLoginWithoutUserNameFail() {
  const credentials = {
    email: "",
    password: "correctPassword",
  };

  let errorMessage;

  try {
    await sessionsServices.login(credentials);
    throw new Error("❌ deberia haber lanzado un error pero no lo lanzó");
  } catch (error) {
    errorMessage = error.message;
  }

  if (errorMessage === "Authentication Error - Please Check your credentials") {
    console.log("👍 testLoginWithoutUserNameFail")
  } else {
    console.log(
      "❌ el error no es el esperado. se lanzó el siguiente error: " + errorMessage
    );
  }
}

async function testLoginWithoutPasswordFail() {
  const credentials = {
    email: "correctEmail",
    password: "",
  };

  let errorMessage;

  try {
    await sessionsServices.register(credentials);
    throw new Error("❌ deberia haber lanzado un error pero no lo lanzó");
  } catch (error) {
    errorMessage = error.message;
  }

  if (errorMessage === "Authentication Error - Please Check your credentials") {
    console.log("👍 testLoginWithoutPasswordFail")
  } else {
    console.log(
      "❌ el error no es el esperado. se lanzó el siguiente error: " + errorMessage
    );
  }
}

async function testLoginWithWrongEmailFail() {
  const credentials = {
    email: "wrongEmail",
    password: "correctPassword",
  };

  let errorMessage;

  try {
    await sessionsServices.login(credentials);
    throw new Error("❌ deberia haber lanzado un error pero no lo lanzó");
  } catch (error) {
    errorMessage = error.message;
  }

  if (errorMessage === "NOT FOUND") {
    console.log("👍 testLoginWithWrongEmailFail")
  } else {
    console.log(
      "❌ el error no es el esperado. se lanzó el siguiente error: " + errorMessage
    );
  }
}

async function testLoginWithWrongPasswordFail() {
  const credentials = {
    email: "correctEmail",
    password: "wrongPassword",
  };

  let errorMessage;

  try {
    await sessionsServices.login(credentials);
    throw new Error("❌ deberia haber lanzado un error pero no lo lanzó");
  } catch (error) {
    errorMessage = error.message;
  }

  if (errorMessage === "Authentication Error - Please Check your credentials") {
    console.log("👍 testLoginWithWrongPasswordFail")
  } else {
    console.log(
      "❌ el error no es el esperado. se lanzó el siguiente error: " + errorMessage
    );
  }
}

await testRegisterWithoutUserNameFail()
await testRegisterWithoutPasswordFail()
await testRegisterWithDuplicatedEmailFail()
await testLoginWithoutUserNameFail()
await testLoginWithoutPasswordFail()
await testLoginWithWrongEmailFail()
await testLoginWithWrongPasswordFail()

