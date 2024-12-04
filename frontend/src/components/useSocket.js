import {io} from "socket.io-client";
import {useState,useEffect} from "react";
const backendBaseUrl="http://localhost:7000";
export const useSocket =() => {
    const [user,setUser]=useState(null);
    const [socket,setSocket]=useState(null);
    
    const connectSocket = () => {
        if (socket?.connected) {
            console.log("Socket is already connected.");
            return;
        }
    
        // if (!user) {
        //     console.log("No user detected! Please set a user before connecting the socket.");
        //     return;
        // }
    
        const newSocket = io(backendBaseUrl);
        newSocket.on("connect", () => {
            console.log("Socket connected:", newSocket.id);
        });
        newSocket.on("disconnect", () => {
            console.log("Socket disconnected:", newSocket.id);
        });
        console.log("setting new socket value");
        console.log(newSocket);
        setSocket(newSocket);
    };
    const disconnectSocket =() =>{
        if (socket && socket.connected) {
            console.log("Socket disconnected successfully.");
            socket.disconnect();
        } else {
            console.log("Socket is not connected or already null.");
        }
    };
    useEffect(() => {
      return () => {
        if (socket) {
          socket.disconnect();
          console.log("Socket disconnected on unmount.");
        }
      };
    }, [socket]);
    
return {user, setUser ,socket, connectSocket,disconnectSocket};
};