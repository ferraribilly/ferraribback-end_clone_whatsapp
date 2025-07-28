import createHttpError from "http-errors";
import { ConversationModel, UserModel } from "../models/index.js";

export const doesConversationExist = async (sender_id, receiver_id) => {
  let convos = await ConversationModel.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: sender_id } } },
      { users: { $elemMatch: { $eq: receiver_id } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (!convos) throw createHttpError.BadRequest("Something went wrong");

  convos = await UserModel.populate(convos, {
    path: "latestMessage.sender",
    select: "name email picture status statusUber",
  });

  return convos[0];
};

// Envia uma solicitação de conversa ligada a um pedido específico
export const sendConversationRequest = async (sender_id, receiver_id, orderId) => {
  // Verifica se já existe uma solicitação pendente ENTRE os dois usuários PARA A MESMA ordem
  const existing = await ConversationModel.findOne({
    isGroup: false,
    status: "pending",
    users: { $all: [sender_id, receiver_id] },
    order: orderId,
  });

  if (existing) {
    throw createHttpError.BadRequest("Request already pending for this order.");
  }

  const request = await ConversationModel.create({
    sender: sender_id,
    receiver: receiver_id,
    users: [sender_id, receiver_id],
    order: orderId,
    isGroup: false,        // se você tiver grupos no schema
    status: "pending",     // default, mas bom deixar explícito
  });

  return request;
};

// Lista todas as solicitações pendentes que o usuário RECEBEU
export const getPendingRequests = async (userId) => {
  const requests = await ConversationModel.find({
    receiver: userId,
    status: "pending",
  }).populate("sender", "-password");

  return requests;
};

// Motorista ou passageiro aceita ou rejeita a solicitação de conversa
export const respondToRequest = async (requestId, status) => {
  if (!["accepted", "rejected"].includes(status)) {
    throw createHttpError.BadRequest("Invalid status.");
  }

  const request = await ConversationModel.findById(requestId);
  if (!request) throw createHttpError.NotFound("Request not found.");

  request.status = status;
  await request.save();

  return request;
};

export const createConversation = async (data) => {
  const newConvo = await ConversationModel.create(data);
  if (!newConvo)
    throw createHttpError.BadRequest("Oops...Something went wrong !");
  return newConvo;
};

export const populateConversation = async (
  id,
  fieldToPopulate,
  fieldsToRemove
) => {
  const populatedConvo = await ConversationModel.findOne({ _id: id }).populate(
    fieldToPopulate,
    fieldsToRemove
  );
  if (!populatedConvo)
    throw createHttpError.BadRequest("Oops...Something went wrong !");
  return populatedConvo;
};

export const getUserConversations = async (user_id) => {
  let conversations;
  await ConversationModel.find({
    users: { $elemMatch: { $eq: user_id } },
  })
    .populate("users", "-password")
    .populate("admin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await UserModel.populate(results, {
        path: "latestMessage.sender",
        select: "name email picture status statusUber",
      });
      conversations = results;
    })
    .catch((err) => {
      throw createHttpError.BadRequest("Oops...Something went wrong !");
    });
  return conversations;
};

export const updateLatestMessage = async (convo_id, msg) => {
  const updatedConvo = await ConversationModel.findByIdAndUpdate(convo_id, {
    latestMessage: msg,
  });
  if (!updatedConvo)
    throw createHttpError.BadRequest("Oops...Something went wrong !");

  return updatedConvo;
};
