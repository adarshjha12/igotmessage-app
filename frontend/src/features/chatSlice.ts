import { Chat } from "@/components/chats/ChatList";
import { createSlice } from "@reduxjs/toolkit";

interface Message {
  sender?: string;
  chat?: string;
  content: string;
  messageType?: string;
  updatedAt: string;
  tempId?: string;
}

interface AiMessage {
  reciever?: string;
  chat?: string;
  content: string;
  updatedAt?: string;
  tempId?: string;
}

interface ChatState {
  allChatIds: string[];
  chatId: string | null;
  onlineUsers: string[];
  lastMessage: Record<string, Message> | null;
  chatList: Chat[] | null;
  messages: Record<string, Message[]> | null;
  recieverLastSeen?: Record<string, Date> | null;
  aiMessage?: AiMessage[] | null;
}

const initialState: ChatState = {
  chatId: null,
  onlineUsers: [],
  lastMessage: null,
  chatList: null,
  messages: null,
  aiMessage: null,
  allChatIds: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatId: (state, action) => {
      state.chatId = action.payload;
      state.allChatIds.push(action.payload);
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    setOfflineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(
        (user) => user !== action.payload
      );
    },

    setNewOnlineUser: (state, action) => {
      state.onlineUsers.push(action.payload);
    },

    setLastMessage: (state, action) => {
      const { chatId, message } = action.payload;
      state.lastMessage = { ...state.lastMessage, [chatId]: message };
    },

    setChatList: (state, action) => {
      state.chatList = action.payload;
    },

    setMessages: (state, action) => {
      if (!state.messages) {
        state.messages = {};
      }
      state.messages[action.payload.chatId] = action.payload.messages;
    },

    setNewMessages: (state, action) => {
      if (!state.messages) {
        state.messages = {};
      }

      const prevMessages = state.messages[action.payload.chatId] || [];
      state.messages[action.payload.chatId] = [
        ...prevMessages,
        ...action.payload.messages,
      ];
    },

    setAiMessages: (state, action) => {
      if (!state.aiMessage) {
        state.aiMessage = [];
      }

      state.aiMessage.push(action.payload);
    },

    setLastSeen: (state, action) => {
      if (!state.recieverLastSeen) {
        state.recieverLastSeen = {};
      }
      state.recieverLastSeen[action.payload.chatId] = action.payload.date;
    },
  },
});

export default chatSlice.reducer;

export const {
  setChatId,
  setOnlineUsers,
  setOfflineUser,
  setNewOnlineUser,
  setLastMessage,
  setChatList,
  setMessages,
  setNewMessages,
  setLastSeen,
  setAiMessages,
} = chatSlice.actions;
