/// <reference types="jest" />
import { User } from "../user.model";
import { userServices } from "../user.service";

jest.mock("../user.model", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe("User Service - createUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a user successfully", async () => {
    const payload = {
      name: "Azad",
      email: "azad@test.com",
      password: "123456",
    };

    const mockCreatedUser = {
      _id: "user-id-123",
      ...payload,
      auths: [
        {
          provider: "credentials",
          providerId: payload.email,
        },
      ],
    };

    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.create as jest.Mock).mockResolvedValue(mockCreatedUser);

    const result = await userServices.createUser(payload);

    expect(User.findOne).toHaveBeenCalledWith({
      email: payload.email,
    });

    expect(User.create).toHaveBeenCalledWith({
      email: payload.email,
      password: payload.password,
      auths: [
        {
          provider: "credentials",
          providerId: payload.email,
        },
      ],
      name: payload.name,
    });

    expect(result).toEqual(mockCreatedUser);
  });

  it("should throw error if user already exists", async () => {
    const payload = {
      name: "Azad",
      email: "azad@test.com",
      password: "123456",
    };

    (User.findOne as jest.Mock).mockResolvedValue({
      _id: "existing-user-id",
      email: payload.email,
    });

    await expect(userServices.createUser(payload)).rejects.toThrow(
      "User already exist",
    );

    expect(User.findOne).toHaveBeenCalledWith({
      email: payload.email,
    });

    expect(User.create).not.toHaveBeenCalled();
  });
});
