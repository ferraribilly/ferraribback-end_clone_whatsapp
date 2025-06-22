import createHttpError from "http-errors";
import logger from "../configs/logger.config.js";
import {
  searchUsers as searchUsersService,
  findUser,
  deleteUser,
  updateUser,
  resetUserPassword,
} from "../services/user.service.js";

// Buscar usuários com base em palavra-chave
export const searchUsers = async (req, res, next) => {
  try {
    const keyword = req.query.search;
    if (!keyword) {
      logger.error("Please add a search query first");
      throw createHttpError.BadRequest("Oops...Something went wrong!");
    }
    const users = await searchUsersService(keyword, req.user.userId);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Buscar os dados do usuário autenticado
export const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await findUser(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Atualizar os dados do usuário autenticado
export const updateMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    // Aqui você pode adicionar validações de campos permitidos, etc.
    const updatedUser = await updateUser(userId, updates);

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Redefinir senha do usuário autenticado
export const resetPassword = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    // A lógica de redefinição pode variar, aqui só um exemplo simples:
    await resetUserPassword(userId);
    res.status(200).json({ message: "Senha redefinida com sucesso." });
  } catch (error) {
    next(error);
  }
};

// Deletar conta do usuário autenticado
export const deleteMyAccount = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await findUser(userId);
    if (!user) {
      logger.warn(`Usuário não encontrado para exclusão: ${userId}`);
      throw createHttpError.NotFound("Usuário não encontrado.");
    }

    await deleteUser(userId);

    res.clearCookie("refreshtoken", { path: "/api/v1/auth/refreshtoken" });
    res.status(200).json({ message: "Conta deletada com sucesso." });

    logger.info(`Conta deletada: ${userId}`);
  } catch (error) {
    logger.error("Erro ao deletar conta", error);
    next(error);
  }
};
