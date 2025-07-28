import express from "express";
import trimRequest from "trim-request";
import {
  searchUsers,
  listUser,
  listUserTipoVeiculo,
  updateUserVehicleInfo,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET: múltiplos handlers → searchUsers, listUser, listUserTipoVeiculo
router.route("/").get(
  trimRequest.all,
  authMiddleware,
  searchUsers,
  listUser,
  listUserTipoVeiculo
);

// POST: (você não definiu ainda qual função vai aqui)
router.route("/").post(trimRequest.all, authMiddleware);

// PUT: atualizar veículo
router.route("/").put(
  trimRequest.all,
  authMiddleware,
  updateUserVehicleInfo
);

export default router;
