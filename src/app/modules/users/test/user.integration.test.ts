/// <reference types="jest" />
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User } from "../user.model";
import app from "../../../../app";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("User Integration Test", () => {
  it("should create a user successfully", async () => {
    const payload = {
      name: "Azad",
      email: "azad@test.com",
      password: "123456",
    };

    const res = await request(app).post("/api/v1/user/register").send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(payload.email);
    expect(res.body.data.auths[0].provider).toBe("credentials");
    expect(res.body.data.auths[0].providerId).toBe(payload.email);

    const userInDb = await User.findOne({ email: payload.email });

    expect(userInDb).toBeTruthy();
    expect(userInDb?.email).toBe(payload.email);
  });

  // it("should not create duplicate user", async () => {
  //   const payload = {
  //     name: "Azad",
  //     email: "azad@test.com",
  //     password: "123456",
  //   };

  //   await User.create({
  //     ...payload,
  //     auths: [
  //       {
  //         provider: "credentials",
  //         providerId: payload.email,
  //       },
  //     ],
  //   });

  //   const res = await request(app)
  //     .post("/api/v1/users/create-user")
  //     .send(payload);

  //   expect(res.statusCode).toBe(409);
  //   expect(res.body.success).toBe(false);
  //   expect(res.body.message).toBe("User already exist");
  // });
});
