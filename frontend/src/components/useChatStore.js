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
            const res=await axios.get(`/messages/${userId}`);
            set({messages:res.data});

        }
        catch(e){
            toast.error("error while getting messages!");
        }
        finally{
            set({isMessagesLoading: false});
        }
    },

    sendMessages: async(messageData)=>{
        const {selectedUser,messages}=get();
        try{
            const res=await axios.post(`${backendBaseUrl}/messages/send/${selectedUser._id}`,messageData,{
            
                headers: {
                  Authorization: `Bearer ${token}`,
                },

              });
            set({messages:[...messages,res.data]})

        }

        catch(e){
            toast.error("error sending the message");
        }
    },

    //optimise this one later
    setSelectedUser:(selectedUser)=> set({selectedUser}),


}))