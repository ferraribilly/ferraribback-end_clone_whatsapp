import express from "express";
import authRoutes from "./auth.route.js";
import userROutes from "./user.route.js";
import ConversationRoutes from "./conversation.route.js";
import MessageRoutes from "./message.route.js";
import storeRoutes from "./store.route.js"
import apiRoutes from "./api.route.js";


const router = express.Router();

//Rotas do Whatsapp Ferrari Aqui
router.use("/auth", authRoutes);
router.use("/user", userROutes);
router.use("/conversation", ConversationRoutes);
router.use("/message", MessageRoutes);

//Rotas 
router.use('/store', storeRoutes);
router.use('/route/request', apiRoutes);

export default router;
