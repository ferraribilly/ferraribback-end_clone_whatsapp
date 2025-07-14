// ✅ src/controllers/conversation.controller.js — CORRIGIDO
import createHttpError from "http-errors";
import logger from "../configs/logger.config.js";
import {
  createConversation,
  doesConversationExist,
  getUserConversations,
  populateConversation,
} from "../services/conversation.service.js";

import {
  findUser,
  getPedidoRequestsService,
  sendPedidoRequestService,
  getAcceptedPedidosService,
} from "../services/user.service.js"; // ← AGORA CORRETO

export const create_open_conversation = async (req, res, next) => {
  try {
    const sender_id = req.user.userId;
    const { receiver_id } = req.body;
    if (!receiver_id) {
      logger.error("receiver_id is required");
      throw createHttpError.BadGateway("Something went wrong");
    }
    const existedConversation = await doesConversationExist(
      sender_id,
      receiver_id
    );
    if (existedConversation) {
      res.json(existedConversation);
    } else {
      let reciever_user = await findUser(receiver_id);
      let convoData = {
        name: reciever_user.name,
        picture: reciever_user.picture,
        isGroup: false,
        users: [sender_id, receiver_id],
      };
      const newConvo = await createConversation(convoData);
      const populatedConvo = await populateConversation(
        newConvo._id,
        "users",
        "-password"
      );
      res.status(200).json(populatedConvo);
    }
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const conversations = await getUserConversations(user_id);
    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};

export const getPedidoRequestsController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await getPedidoRequestsService(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const sendPedidoRequestController = async (req, res, next) => {
  try {
    const { senderId, recepientId, tipoVeiculo } = req.body;
    const result = await sendPedidoRequestService({ senderId, recepientId, tipoVeiculo });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAcceptedPedidosController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await getAcceptedPedidosService(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createGroup = async (req, res, next) => {
  try {
    const { name, users } = req.body;
    users.push(req.user.userId);
    if (!name || !users) {
      throw createHttpError.BadRequest("Please fill all fields.");
    }
    if (users.length < 2) {
      throw createHttpError.BadRequest(
        "At least 2 users are required to start a group chat."
      );
    }
    let convoData = {
      name,
      users,
      isGroup: true,
      admin: req.user.userId,
      picture: process.env.DEFAULT_GROUP_PICTURE,
    };
    const newConvo = await createConversation(convoData);
    const populatedConvo = await populateConversation(
      newConvo._id,
      "users admin",
      "-password"
    );
    res.status(200).json(populatedConvo);
  } catch (error) {
    next(error);
  }
};
