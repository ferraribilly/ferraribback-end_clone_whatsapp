import express from "express";
import { createRoutes } from "../controllers/api.controller.js";

const router = express.Router();

// Corrigido para evitar rota duplicada
router.get("/", createRoutes);

export default router;
