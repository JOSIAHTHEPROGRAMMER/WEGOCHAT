import express from "express";
import {protectRoute} from "../middleware/auth.js";
import { getMessages, getUsersForLeftSidebar, markMessagesAsRead, sendMessage } from "../controllers/messageController.js";


const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUsersForLeftSidebar);
messageRouter.get("/:id",protectRoute,getMessages);
messageRouter.put("/mark/:id", protectRoute, markMessagesAsRead );
messageRouter.post("/send/:id", protectRoute, sendMessage)

export default messageRouter;