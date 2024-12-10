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
    
        const newSocket = io(backendBaseUrl);
        console.log("before bro");
        newSocket.on("connect", () => {
            console.log("Socket connected:", newSocket.id);
        });
        console.log("after bro");
        console.log("setting new socket value");
        setSocket(newSocket);
        console.log("newsocket");
        console.log(newSocket);
        console.log("socket");
        console.log(socket);
        newSocket.on("disconnect", () => {
            console.log("triggered disconnect!");
            console.log("Socket disconnected:");
        });
    };
    const disconnectSocket =() =>{
        console.log("called discount ! !");
        if (socket && socket.connected) {
            console.log("socket id before disconnecting",socket.id);
            socket.disconnect();
            console.log("Socket disconnected successfully.");
        } else {
            console.log("Socket is not connected or already null.");
        }
    };
    useEffect(() => {
      return () => {
        if (socket) {
        console.log("socket value before unmount",socket.id);
        // socket.disconnect();
        // disconnectSocket();
    
            
          console.log("socket value after  unmount",socket.id);
          console.log("Socket disconnected on unmount.");
        }
        else
        {
            console.log("no socket exists !")
        }
      };
    }, [socket]);
 
    
return {user, setUser ,socket, connectSocket,disconnectSocket};
};