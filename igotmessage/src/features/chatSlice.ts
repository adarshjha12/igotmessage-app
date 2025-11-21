import { createSlice } from "@reduxjs/toolkit";


interface Message {
  sender?: string;
  chat?: string;
  content: string;
  messageType?: string;
  updatedAt: string;
  tempId?: string;
}

interface ChatList{
   
}

interface ChatState {
  chatId: string;
  onlineUsers: string[]
  lastMessage: Record<string, Message> | null
  chatList?: any
}

const initialState: ChatState = {
  chatId: "",
  onlineUsers: [],
  lastMessage: null
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatId: (state, action) => {
      state.chatId = action.payload;
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    setOfflineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter((user) => user !== action.payload);
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
  },
});

export default chatSlice.reducer;

export const { setChatId, setOnlineUsers, setOfflineUser, setNewOnlineUser, setLastMessage } = chatSlice.actions;
