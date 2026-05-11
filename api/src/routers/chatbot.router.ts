import { deleteAllChatHistories, deleteChatHistory, getAllChatHistories, getDetailedChat, saveChat } from "../controllers/chatbot.controller";
import { Router } from "express";
import { checkOwnership, verifyToken } from "../middleware/auth.middleware";

const chatBotRouters = Router();

chatBotRouters.delete("/remove-all/:user_id", verifyToken, checkOwnership, deleteAllChatHistories);
chatBotRouters.delete("/remove/:id", verifyToken, deleteChatHistory);

chatBotRouters.get("/all-chat-histories/:user_id", verifyToken, checkOwnership, getAllChatHistories);
chatBotRouters.get("/detail/:id", verifyToken, getDetailedChat);

chatBotRouters.post("/send-question", verifyToken, saveChat);

export default chatBotRouters;