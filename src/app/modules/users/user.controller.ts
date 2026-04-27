import { Request, Response } from "express";

import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";

const createUser = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response) => {
    const result = await userServices.createUser(req.body);

    res.status(201).send({
      success: true,
      statusCode: 201,
      message: "Users created successfully",
      data: result,
    });
  },
);
export const userController = {
  createUser,
};
