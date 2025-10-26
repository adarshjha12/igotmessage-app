import { Router } from "express"
import { createOrGetChat } from "../../controllers/chats/chatController"


export const chatRouter = Router()

chatRouter.post("/create-chat", createOrGetChat)