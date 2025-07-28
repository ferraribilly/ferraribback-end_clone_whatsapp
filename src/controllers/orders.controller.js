// src/controllers/orders.controller.js
import {
  criarPedidoService,
  buscarPedidosPorTipo,
  buscarPedidoPorId,
  atualizarPedido,
} from "../services/orders.service.js";

// ✅ Lista de usuários online com socketId
import { onlineUsers } from "../SocketServer.js";

// 📌 Criar Pedido
export const criarPedido = async (req, res) => {
  try {
    if (!req.body.userId) {
      return res.status(400).json({ message: "userId é obrigatório." });
    }

    const io = req.io;

    // 🔍 Buscar socketId do motorista online
    const motoristaId = req.body.motorista._id;
    const motoristaOnline = onlineUsers.find((u) => u.userId === motoristaId);

    // 🎯 Pega o socketId se motorista estiver online
    const socketId = motoristaOnline ? motoristaOnline.socketId : null;

    // ⚙️ Criar pedido, passando io e socketId para emitir a notificação
    const pedidoCriado = await criarPedidoService(req.body, io, socketId);

    res.status(201).json({
      message: "Pedido criado com sucesso!",
      pedido: pedidoCriado,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const listarPedidosPorTipo = async (req, res) => {
  try {
    const { tipo } = req.params;
    const pedidos = await buscarPedidosPorTipo(tipo);
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const pegarPedidoPorId = async (req, res) => {
  try {
    const pedido = await buscarPedidoPorId(req.params.id);
    res.status(200).json(pedido);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const atualizarPedidoController = async (req, res) => {
  try {
    const pedido = await atualizarPedido(req.params.id, req.body);
    res.status(200).json({ message: "Pedido atualizado com sucesso!", pedido });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};




