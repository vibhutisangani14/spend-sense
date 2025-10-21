import { User } from "#models";
import type { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import type { z } from "zod";
import type { userInputSchema, userSchema } from "#schemas";

type UserInputDTO = z.infer<typeof userInputSchema>;
type UserDTO = z.infer<typeof userSchema>;

export const getAllUsers: RequestHandler<{}, UserDTO[]> = async (req, res) => {
  const allUsers = await User.find().lean();
  res.json(allUsers);
};

export const createUser: RequestHandler<{}, UserDTO, UserInputDTO> = async (
  req,
  res
) => {
  const newUser = await User.create<UserInputDTO>(req.body);
  res.json(newUser);
};

export const getUserById: RequestHandler<{ id: string }, UserDTO> = async (
  req,
  res
) => {
  const { id } = req.params;

  if (!isValidObjectId(id))
    throw new Error("Invalid ID", { cause: { status: 400 } });

  const user = await User.findById(id);
  if (!user) throw new Error("User not found", { cause: { status: 404 } });
  res.json(user);
};

export const updateUserById: RequestHandler<
  { id: string },
  UserDTO,
  UserInputDTO
> = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id))
    throw new Error("Invalid ID", { cause: { status: 400 } });

  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updatedUser)
    throw new Error("User not found!", { cause: { status: 404 } });
  res.json(updatedUser);
};

export const deleteUserById: RequestHandler<
  { id: string },
  { message: string }
> = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    throw new Error("Invalid ID", { cause: { status: 400 } });

  const found = await User.findByIdAndDelete(id);

  if (!found) throw new Error("User Not Found", { cause: { status: 404 } });

  res.json({ message: "User deleted successfully" });
};
