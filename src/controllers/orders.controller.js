import {
  criarPedidoService,
  buscarPedidosPorTipo,
  buscarPedidoPorId,
  atualizarPedido
} from "../services/orders.service.js";

export const criarPedido = async (req, res) => {
  try {
    if (!req.body.userId) {
      return res.status(400).json({ message: "userId é obrigatório." });
    }
    const novoPedido = await criarPedidoService(req.body);
    res.status(201).json({ message: "Pedido criado com sucesso!", pedido: novoPedido });
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
