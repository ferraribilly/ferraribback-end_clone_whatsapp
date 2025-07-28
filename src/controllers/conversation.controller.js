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
} from "../services/user.service.js"; 

// Envia solicitação de conversa (com orderId)
export const sendRequest = async (req, res, next) => {
  try {
    const senderId = req.user.userId;
    const { receiverId, orderId } = req.body;

    if (!receiverId || !orderId) {
      throw createHttpError.BadRequest("Receiver ID and Order ID are required.");
    }

    const request = await sendConversationRequest(senderId, receiverId, orderId);
    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

// Cria ou retorna conversa aberta entre dois usuários
export const create_open_conversation = async (req, res, next) => {
  try {
    const sender_id = req.user.userId;
    const { receiver_id } = req.body;

    if (!receiver_id) {
      logger.error("receiver_id is required");
      throw createHttpError.BadGateway("Something went wrong");
    }

    const existedConversation = await doesConversationExist(sender_id, receiver_id);

    if (existedConversation) {
      return res.json(existedConversation);
    } 

    const receiver_user = await findUser(receiver_id);
    const convoData = {
      name: receiver_user.name,
      picture: receiver_user.picture,
      isGroup: false,
      users: [sender_id, receiver_id],
    };
    const newConvo = await createConversation(convoData);
    const populatedConvo = await populateConversation(newConvo._id, "users", "-password");
    res.status(200).json(populatedConvo);

  } catch (error) {
    next(error);
  }
};

// Lista as conversas do usuário logado
export const getConversations = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const conversations = await getUserConversations(user_id);
    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};

// // Lista todas as solicitações pendentes recebidas pelo usuário logado
// export const listRequests = async (req, res, next) => {
//   try {
//     const requests = await getPendingRequests(req.user.userId);
//     res.status(200).json(requests);
//   } catch (error) {
//     next(error);
//   }
// };

// // Responde (aceita ou rejeita) uma solicitação
// export const respondRequest = async (req, res, next) => {
//   try {
//     const { requestId, status } = req.body;
//     const updated = await respondToRequest(requestId, status);

//     if (status === "accepted") {
//       const receiverUser = await findUser(updated.receiver);
//       const convoData = {
//         name: receiverUser.name,
//         picture: receiverUser.picture,
//         isGroup: false,
//         users: [updated.sender, updated.receiver],
//       };

//       const convo = await createConversation(convoData);
//       const populated = await populateConversation(convo._id, "users", "-password");

//       return res.status(200).json({ status: "accepted", conversation: populated });
//     }

//     res.status(200).json({ status: updated.status });
//   } catch (error) {
//     next(error);
//   }
// };

// Cria um grupo de conversa
export const createGroup = async (req, res, next) => {
  try {
    const { name, users } = req.body;
    users.push(req.user.userId);

    if (!name || !users) {
      throw createHttpError.BadRequest("Please fill all fields.");
    }
    if (users.length < 2) {
      throw createHttpError.BadRequest("At least 2 users are required to start a group chat.");
    }

    const convoData = {
      name,
      users,
      isGroup: true,
      admin: req.user.userId,
      picture: process.env.DEFAULT_GROUP_PICTURE,
    };

    const newConvo = await createConversation(convoData);
    const populatedConvo = await populateConversation(newConvo._id, "users admin", "-password");
    res.status(200).json(populatedConvo);
  } catch (error) {
    next(error);
  }
};
