import { Router } from "express";
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
} from "#controllers";
import { validateBody } from "#middleware";
import { userInputSchema } from "#schemas";

const userRouter = Router();

userRouter
  .route("/")
  .get(getAllUsers)
  .post(validateBody(userInputSchema), createUser);
userRouter
  .route("/:id")
  .get(getUserById)
  .put(validateBody(userInputSchema), updateUserById)
  .delete(deleteUserById);

export default userRouter;
