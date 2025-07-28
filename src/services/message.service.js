import createHttpError from "http-errors";
import { MessageModel } from "../models/index.js";
// mensgens normais
export const createMessage = async (data) => {
  let newMessage = await MessageModel.create(data);
  if (!newMessage)
    throw createHttpError.BadRequest("Oops...Something went wrong !");
  return newMessage;
};
// Mensagem Normais
export const populateMessage = async (id) => {
  let msg = await MessageModel.findById(id)
    .populate({
      path: "sender",
      select: "name picture",
      model: "UserModel",
    })
    .populate({
      path: "conversation",
      select: "name picture isGroup users",
      model: "ConversationModel",
      populate: {
        path: "users",
        select: "name email picture status ",
        model: "UserModel",
      },
    });
  if (!msg) throw createHttpError.BadRequest("Oops...Something went wrong !");
  return msg;
};

//Mensagens Normais
export const getConvoMessages = async (convo_id) => {
  const messages = await MessageModel.find({ conversation: convo_id })
    .populate("sender", "name picture email status")
    .populate("conversation");
  if (!messages) {
    throw createHttpError.BadRequest("Oops...Something went wrong !");
  }
  return messages;
};

export const deleteMessagesByIds = async (messageIds) => {
  return await Message.deleteMany({ _id: { $in: messageIds } });
};















// mensagens Automaticas
export const createMessageAutomatica = async (data) => {
  let newMessageAutomatica = await MessageModel.create(data);
  if (!newMessageAutomatica)
    throw createHttpError.BadRequest("Oops...Something went wrong !");
  return newMessage;
};




// mensagem automatica
export const populateMessageAutomatica = async (id) => {
  let msgAuto = await MessageModel.findById(id)
    .populate({
      path: "sender",
      select: "name picture",
      model: "UserModel",
    })
    .populate({
      path: "conversation",
      select: "name picture isGroup users",
      model: "ConversationModel",
      populate: {
        path: "users",
        select: "name email picture status",
        model: "UserModel",
      },
    });
  if (!msgAuto) throw createHttpError.BadRequest("Oops...Something went wrong !");
  return msgAuto;
};

export const getConvoMessagesAutomatica = async (convo_id) => {
  const messagesAutomatica = await MessageModel.find({ conversation: convo_id })
    .populate("sender", "name picture email status")
    .populate("conversation");
  if (!messagesAutomatica) {
    throw createHttpError.BadRequest("Oops...Something went wrong !");
  }
  return messagesAutomatica;
};

export const deleteMessagesAutomaticaByIds = async (messageAutomaticaIds) => {
  return await Message.deleteMany({ _id: { $in: messageAutomaticaIds } });
};







