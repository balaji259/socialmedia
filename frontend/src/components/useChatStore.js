import {create} from "zustand";
import toast from "react-hot-toast";
import axios from "axios";
// import {axiosInstance} from "../lib/axios";
const backendBaseUrl = "http://localhost:7000";
const token=localStorage.getItem('token');

export const useChatStore = create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,


    getUsers: async()=>{
        set({isUsersLoading: true});
        try{
            const res=await axios.get(`${backendBaseUrl}/messages/getusers`,{
            
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            console.log("sidebar user data");
            console.log(res.data);
            set({users:res.data});

        }
        catch(e){
            toast.error(e.message || "error");
            set({ users: [] });

        }
        finally{
            set({isUsersLoading: false});
        }
    },

    getMessages: async(userId) => {
        set({isMessagesLoading: true});
        try{
            const res=await axios.get(`${backendBaseUrl}/messages/get/${userId}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            // set({messages:res.data});
            console.log("getmessages checking");
            console.log(res);
            console.log("res.data.messages")
            console.log(res.data);
            set({ messages: Array.isArray(res.data) ? res.data: [] });

        }
        catch(e){
            toast.error("error while getting messages!");
            set({ messages: [] }); 
        }
        finally{
            set({isMessagesLoading: false});
        }
    },

    sendMessages: async(messageData)=>{
        const {selectedUser,messages}=get();

        // console.log("selecteruserid");  
        // console.log(selectedUser._id);
        // console.log("selecteruserid"); 

        try{
            console.log("checking msg at star5t");
            console.log(messages);
            const res=await axios.post(`${backendBaseUrl}/messages/send/${selectedUser._id}`,messageData,{
            
                headers: {
                  Authorization: `Bearer ${token}`,
                },

              });

            // console.log("prevmsg");
            // console.log(messages); 

            // console.log("messages");
            // console.log(res.data);
            set({messages:[...messages,res.data]})

        }

        catch(e){
            toast.error("error sending the message");
        }
    },

    //optimise this one later
    setSelectedUser:(selectedUser)=> set({selectedUser}),


}))