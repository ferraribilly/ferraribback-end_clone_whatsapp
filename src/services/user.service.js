import createHttpError from "http-errors";
import { UserModel } from "../models/index.js";

export const findUser = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user) throw createHttpError.BadRequest("Please fill all fields.");
  return user;
};

export const searchUsers = async (keyword, userId) => {
  const users = await UserModel.find({
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
      { tipoVeiculo: { $regex: keyword, $options: "i" } }, 
    ],
    _id: { $ne: userId },
  });

  return users;
};


export const updateUserVehicleInfoService = async (userId, data) => {
  const user = await UserModel.findById(userId);
  if (!user) throw createHttpError.NotFound("Usuário não encontrado.");

  user.tipoVeiculo = data.tipoVeiculo || user.tipoVeiculo;
  user.corVeiculo = data.corVeiculo || user.corVeiculo;
  user.placa = data.placa || user.placa;
  user.marca = data.marca || user.marca;

  await user.save();
  return user;
};


// Buscar pedidos recebidos
export const getPedidoRequestsService = async (userId) => {
  const user = await UserModel.findById(userId)
    .populate("pedidoRequests", "name email picture")
    .lean();

  if (!user) throw createHttpError.NotFound("Usuário não encontrado.");
  return user.pedidoRequests;
};

// Enviar pedido (com tipoVeiculo)
export const sendPedidoRequestService = async ({ senderId, recepientId, tipoVeiculo }) => {
  const sender = await UserModel.findById(senderId);
  const recepient = await UserModel.findById(recepientId);

  if (!sender || !recepient) throw createHttpError.NotFound("Usuário não encontrado.");

  sender.pedido.push(recepientId);
  recepient.pedido.push(senderId);

  recepient.pedidoRequests = recepient.pedidoRequests.filter(
    (request) => request.toString() !== senderId.toString()
  );

  sender.sentPedidoRequests = sender.sentPedidoRequests.filter(
    (request) => request.toString() !== recepientId.toString()
  );

  if (tipoVeiculo) {
    sender.tipoVeiculo = tipoVeiculo;
  }

  await sender.save();
  await recepient.save();

  return { message: "Pedido enviado com sucesso" };
};

// Buscar pedidos aceitos
export const getAcceptedPedidosService = async (userId) => {
  const user = await UserModel.findById(userId).populate("pedido", "name email picture");

  if (!user) throw createHttpError.NotFound("Usuário não encontrado.");
  return user.pedido;
};

// Buscar solicitações enviadas
export const fetchSentFriendRequests = async (userId) => {
  const user = await UserModel.findById(userId)
    .populate("sentPedidoRequests", "name email picture")
    .lean();

  if (!user) throw new Error("User not found");

  return user.sentPedidoRequests;
};

// Buscar amigos (caronas aceitas)
export const fetchUserFriends = async (userId) => {
  const user = await UserModel.findById(userId)
    .populate("pedidos", "name email picture")
    .lean();

  if (!user) throw new Error("User not found");

  return user.pedidos.map((friend) => friend._id);
};

// Enviar pedido de carona para todos com tipoVeiculo X
export const sendFriendRequestsByVehicle = async (senderId, tipoVeiculo) => {
  const sender = await UserModel.findById(senderId);
  if (!sender) throw new Error("Sender not found");

  // Buscar usuários com tipo de veículo (exceto o próprio sender)
  const recipients = await UserModel.find({
    tipoVeiculo,
    _id: { $ne: senderId }
  });

  const recipientIds = recipients.map(u => u._id.toString());

  // Atualiza sender: sentPedidoRequests
  sender.sentPedidoRequests = [
    ...new Set([
      ...sender.sentPedidoRequests.map(id => id.toString()),
      ...recipientIds
    ])
  ];
  await sender.save();


  await UserModel.updateMany(
    { _id: { $in: recipientIds } },
    { $addToSet: { pedidoRequests: sender._id } }
  );

  return recipients;
};

