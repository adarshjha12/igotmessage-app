import { Router } from "express"
import { createOrGetChat, getMessages, getMyChats } from "../../controllers/chats/chatController"


export const chatRouter = Router()

chatRouter.post("/create-chat", createOrGetChat)
chatRouter.get("/get-messages", getMessages)
chatRouter.get("/get-my-chats", getMyChats)