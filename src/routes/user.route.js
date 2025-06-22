import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  searchUsers,
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
  resetPassword,
} from "../controllers/user.controller.js";

const router = express.Router();

// Buscar outros usuários
router.route("/").get(trimRequest.all, authMiddleware, searchUsers);

// Buscar meus dados
router.route("/me").get(trimRequest.all, authMiddleware, getMyProfile);

// Atualizar meus dados
router.route("/me").patch(trimRequest.all, authMiddleware, updateMyProfile);

// Redefinir senha (via email, token ou fluxo seguro)
router.route("/redefinir-senha").post(trimRequest.all, authMiddleware, resetPassword);

// Deletar minha conta
router.route("/deletar").delete(trimRequest.all, authMiddleware, deleteMyAccount);

export default router;
