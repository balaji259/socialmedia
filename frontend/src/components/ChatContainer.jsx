import {useChatStore} from "./useChatStore";
import {useEffect, useState} from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";

import axios from "axios";
const backendBaseUrl="http://localhost:7000";


// const authenticateUser=require("../../../backend/routes/authenticate_user");

const  ChatContainer=() =>{
    const {messages,getMessages,isMessagesLoading,selectedUser}=useChatStore();
    const [userId,setUserId]=useState();
    const [user,setUser]=useState();


    const formatMessageTime=(date) => {
        return new Date(date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      }

   
    const getUserId=async() =>{
        try{
            const token=localStorage.getItem("token");
            const res=await axios.get(`${backendBaseUrl}/user/userId`,{
            
                headers: {
                  Authorization: `Bearer ${token}`,
                },

              })
              console.log("get request");
              console.log(res.data);
              setUserId(res.data);
        }
        catch(e){
            console.log("error fetching userId");
        }
    }

    const getUserData= async () =>{
        try{
            const token=localStorage.getItem("token");
            const res=await axios.get(`${backendBaseUrl}/user/getdetails`,{
                headers: {
                    Authorization:`Bearer ${token}`,
                },

            })
            console.log("userdetails");
            console.log(res.data);
            setUser(res.data);
        }
        catch(e){
            console.log("error getting user profilePic!");
        }
    }


    useEffect(() => {
        // console.log(req.user.userId);
        // console.log(selectedUser._id);
        getMessages(selectedUser._id);
        
        getUserId();
        getUserData();
        // console.log(user);
        console.log("this is userid bro");
        console.log(userId);


    },[selectedUser._id,getMessages]);

    if(isMessagesLoading) return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <MessageSkeleton />
            <MessageInput />    
        </div>
        
    )


    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message)=> (
                    <div key={message._id}
                        className={`chat ${message.senderId ===userId ? "chat-end" :"chat-start"}`}>
                            <div className="chat-image avatar">
                                <div className="size-10 rounded-full border">
                                    <img 
                                        // src={message.senderId === userId ? {`${backendBaseUrl}${user.profilePic}`} || "/avatar.png" : {`${backendBaseUrl}${selectedUser.profilePic}`} || "/avatar.png"}
                                        src={
                                            message.senderId === userId 
                                              ? (user.profilePic ? `${backendBaseUrl}${user.profilePic}` : "/avatar.png") 
                                              : (selectedUser.profilePic ? `${backendBaseUrl}${selectedUser.profilePic}` : "/avatar.png")
                                          }
                                        
                                        alt="profile pic"
                                        />              
                                </div>
                            </div>
                            <div className="chat-header mb-1">
                                <time className="text-xs opacity-50 ml-1">
                                    {formatMessageTime(message.createdAt)}
                                </time>
                            </div>
                            <div className="chat-bubble flex">
                                {message.image && (
                                    <img 
                                        src={message.image}
                                        alt="Attachment"
                                        className="sm:max-w-[200px] rounded-md mb-2"
                                        />
                                )}
                                {message.text && <p>{message.text}</p>}
                            </div>
                    </div>
                ))}
            </div>

            <MessageInput />
             



        </div>
    )

    



};

export default ChatContainer;