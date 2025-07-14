import express from "express";
import {
  criarPedido,
  listarPedidosPorTipo,
  pegarPedidoPorId,
  atualizarPedidoController
} from "../controllers/orders.controller.js";

const router = express.Router();

router.post("/", criarPedido);
router.get("/tipo/:tipo", listarPedidosPorTipo); 
router.get("/:id", pegarPedidoPorId);
router.put("/:id", atualizarPedidoController);

export default router;
