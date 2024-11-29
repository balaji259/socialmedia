import { create } from "zustand";
// import { axiosInstance } from "../lib/axios.js"/;
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client"

const backendBaseUrl="http://localhost:7000";

export const useSocketStore = create((set,get) => ({

  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  

  connectSocket: () => {
    const { authUser,  } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });

    // const socket=io(backendBaseUrl);

    socket.connect();

    set({ socket: socket });

    // socket.on("getOnlineUsers", (userIds) => {
    //   set({ onlineUsers: userIds });
    // });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}
));