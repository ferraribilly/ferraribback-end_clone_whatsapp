import express from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import conversationRoutes from "./conversation.route.js";
import messageRoutes from "./message.route.js";
import ordersRoutes from "./orders.route.js";
import webhookRoutes from "./webhook.route.js";


const router = express.Router();

// relacionada aos users
router.use("/auth", authRoutes);
router.use("/user", userRoutes); 
router.use("/:userId", userRoutes);
router.use("/list/sem-veiculo", userRoutes);
router.use("/vehicle/update", userRoutes);

// relacionada  a conversation
router.use("send", conversationRoutes);
router.use("pending", conversationRoutes);
router.use("respond", conversationRoutes);
router.use("/conversation", conversationRoutes);

// relacionada  a mensagem
router.use("/message", messageRoutes);


// relacionada a orders
router.use("/orders", ordersRoutes); 

// relacionada  a webhook 
router.use("/notifications", webhookRoutes); 


export default router;
