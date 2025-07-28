import createHttpError from "http-errors";
import logger from "../configs/logger.config.js";
import {
  searchUsers as searchUsersService,
  // fetchSentFriendRequests,
  // fetchUserFriends,
  // sendFriendRequestsByVehicle,
  // sendPedidoRequestService
} from "../services/user.service.js";

export const searchUsers = async (req, res, next) => {
  try {
    const keyword = req.query.search;
    if (!keyword) {
      logger.error("Please add a search query first");
      throw createHttpError.BadRequest("Oops...Something went wrong !");
    }
    const users = await searchUsersService(keyword, req.user.userId);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};



// export const getSentFriendRequests = async (req, res, next) => {
//   try {
//     const { userId } = req.params;
//     const sentRequests = await fetchSentFriendRequests(userId);
//     res.json(sentRequests);
//   } catch (error) {
//     next(error);
//     console.error("Erro ao buscar solicitações enviadas:", error);
//     res.status(500).json({ error: "Erro interno" });
//   }
// };

// export const getFriends = async (req, res, next) => {
//   try {
//     const { userId } = req.params;
//     const friendIds = await fetchUserFriends(userId);
//     res.status(200).json(friendIds);
//   } catch (error) {
//     next(error);
//     console.error("Erro ao buscar amigos:", error);
//     res.status(500).json({ message: "Erro interno" });
//   }
// };

// export const sendFriendRequests = async (req, res, next) => {
//   try {
//     const { userId, tipoVeiculo } = req.body;

//     if (!userId || !tipoVeiculo) {
//       return res.status(400).json({ message: "userId e tipoVeiculo são obrigatórios" });
//     }

//     const recipients = await sendFriendRequestsByVehicle(userId, tipoVeiculo);

//     res.status(200).json({
//       message: `Solicitações enviadas para ${recipients.length} usuários com veículo tipo "${tipoVeiculo}".`,
//       recipients: recipients.map(u => ({
//         _id: u._id,
//         name: u.name,
//         email: u.email
//       }))
//     });
//   } catch (error) {
//     next(error);
//     console.error("Erro ao enviar solicitações:", error);
//     res.status(500).json({ message: "Erro interno no servidor" });
//   }
// };

// // ✅ NOVO CONTROLLER - aceitar pedido por tipo de veículo
// export const acceptFriendRequestByVehicle = async (req, res, next) => {
//   try {
//     const { recepientId, tipoVeiculo } = req.body;
//     const senderId = req.user.userId;

//     if (!recepientId || !tipoVeiculo) {
//       return res.status(400).json({ message: "Campos obrigatórios ausentes." });
//     }

//     const result = await sendPedidoRequestService({ senderId, recepientId, tipoVeiculo });

//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//     console.error("Erro ao aceitar pedido:", error);
//     res.status(500).json({ message: "Erro ao aceitar o pedido" });
//   }
// };