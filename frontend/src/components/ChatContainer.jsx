import {useChatStore} from "./useChatStore";
import {useEffect, useState,useRef} from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import {useSocket} from "./useSocket";

import axios from "axios";
const backendBaseUrl="http://localhost:7000";


// const authenticateUser=require("../../../backend/routes/authenticate_user");

const  ChatContainer=() =>{
    const {messages,getMessages,isMessagesLoading,selectedUser,subscribeToMessages,unsubscribeFromMessages}=useChatStore();
    const [userId,setUserId]=useState();
    const [user,setUser]=useState();

    const {socket} =useSocket();

    const messageEndRef=useRef(null);


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
              console.log("get userId request");
              console.log(res);
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
            console.log("get userdetails request this");
            console.log(res);
            console.log(res.data);
            setUser(res.data);
        }
        catch(e){
            console.log("error getting user profilePic!");
        }
    }

    useEffect(() => {
      if(messageEndRef.current && messages){
        messageEndRef.current.scrollIntoView({behavior: "smooth"});
      }

      console.log("check user");
      console.log(user);

      console.log("messages");
      console.log(messages);

    },[messages])



    useEffect(() => {
        // console.log(req.user.userId);
        // console.log(selectedUser._id);
        getMessages(selectedUser._id);
        

        getUserId();
        getUserData();

        console.log("socketvaklue");
        console.log(socket);

        subscribeToMessages(socket);
        console.log("user");
        console.log(user);
        console.log("this is userid bro");
        console.log(userId);

        return () => unsubscribeFromMessages(socket);


    },[selectedUser._id,getMessages,subscribeToMessages,unsubscribeFromMessages]);

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
    {messages.map((message) => (
      <div
        key={message._id}
        className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"}`}
        ref={messageEndRef}
      >
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-md border overflow-hidden">
    
            <img
  src={
    message.senderId === userId
      ? user?.profilePic === "/images/default_profile.jpeg"
        ? "/images/default_profile.jpeg"
        : user?.profilePic
        ? `${backendBaseUrl}${user?.profilePic}`
        : "/avatar.png"
      : selectedUser.profilePic === "/images/default_profile.jpeg"
      ? "/images/default_profile.jpeg"
      : selectedUser.profilePic
      ? `${backendBaseUrl}${selectedUser.profilePic}`
      : "/avatar.png"
  }
  alt="profile pic"
/>

          </div>
        </div>

        {/* Message Content */}
        <div className={`max-w-md ${message.senderId === userId ? "text-right ml-2" : "text-left mr-2"}`}>
          {/* Message Header */}
          <div className="mb-1">
            <time className="text-xs opacity-50">
              {formatMessageTime(message.createdAt)}
            </time>
          </div>

          {/* Chat Bubble */}
          <div className={`inline-block bg-primary text-white px-4 py-2 rounded-lg ${message.senderId === userId ? "bg-blue-500 text-white" : "bg-blue-500 text-white"}`}>
            
            {message.media && (
                  <>
                    {message.mediaType === "image" && (
                      <img
                        src={message.media}
                        alt="Attachment"
                        className="sm:max-w-[200px] rounded-md mb-2"
                      />
                    )}
                    {message.mediaType === "video" && (
                      <video
                        src={message.media}
                        controls
                        className="sm:max-w-[200px] rounded-md mb-2"
                      />
                    )}
                  </>
                )}
                {/* Text Message */}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

  <MessageInput />
</div>

    )

    



};

export default ChatContainer;