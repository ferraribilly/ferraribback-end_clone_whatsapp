import express from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import conversationRoutes from "./conversation.route.js";
import messageRoutes from "./message.route.js";
import ordersRoutes from "./orders.route.js"
import webhookRoutes from "./webhook.route.js";


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes); 
router.use("/conversation", conversationRoutes);
router.use("/message", messageRoutes);
router.use("/orders", ordersRoutes); 
router.use("/notifications", webhookRoutes); 


export default router;


