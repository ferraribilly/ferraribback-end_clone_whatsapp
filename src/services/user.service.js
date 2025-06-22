import { UserModel } from "../models/index.js";
import createHttpError from "http-errors";

export const searchUsers = async (keyword, userId) => {
  const users = await UserModel.find({
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
    ],
    _id: { $ne: userId },
  });
  return users;
};

export const findUser = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user) throw createHttpError.NotFound("Usuário não encontrado.");
  return user;
};

export const deleteUser = async (userId) => {
  await UserModel.findByIdAndDelete(userId);
};

// Atualizar usuário - patch com dados recebidos
export const updateUser = async (userId, updates) => {
  const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, { new: true });
  if (!updatedUser) throw createHttpError.NotFound("Usuário não encontrado.");
  return updatedUser;
};

// Função para redefinir senha - Exemplo simples, ajuste conforme seu fluxo
export const resetUserPassword = async (userId) => {
  // Exemplo: redefinindo a senha para uma padrão temporária "123456"
  const tempPassword = "123456"; // ideal: gerar token e enviar email

  const user = await UserModel.findById(userId);
  if (!user) throw createHttpError.NotFound("Usuário não encontrado.");

  user.password = tempPassword; // aqui pode ser necessário hash na senha (bcrypt)
  await user.save();

  // Você pode adicionar envio de email com a senha temporária aqui

  return true;
};
