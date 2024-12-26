// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import {useSocket} from "./useSocket";
// import {useChatStore} from "./useChatStore";
// import MessageInput from "./MessageInput";
// const ChatFriend = ({ currentUserId }) => {
//   const { friendId } = useParams();
//   const [friend, setFriend] = useState(null);
  
//   const {onlineUsers} =useSocket();
//   const backendBaseUrl='http://localhost:7000';
//   const {messages,getMessages,isMessagesLoading,selectedUser,subscribeToMessages,unsubscribeFromMessages}=useChatStore();
//     const [userId,setUserId]=useState();
//     const [user,setUser]=useState();

//     const {socket} =useSocket();

//     const getUserId=async() =>{
//       try{
//           const token=localStorage.getItem("token");
//           const res=await axios.get(`${backendBaseUrl}/user/userId`,{
          
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },

//             })
//             console.log("get userId request");
//             console.log(res);
//             console.log(res.data);
//             setUserId(res.data);
//       }
//       catch(e){
//           console.log("error fetching userId");
//       }
//   }

//   const getUserData= async () =>{
//       try{
//           const token=localStorage.getItem("token");
//           const res=await axios.get(`${backendBaseUrl}/user/getdetails`,{
//               headers: {
//                   Authorization:`Bearer ${token}`,
//               },

//           })
//           console.log("get userdetails request this");
//           console.log(res);
//           console.log(res.data);
//           setUser(res.data);
//       }
//       catch(e){
//           console.log("error getting user profilePic!");
//       }
//   }
  

//   useEffect(() => {
//     const fetchFriend = async () => {
//       try {
//         console.log('on ChatFriend');
//         const response = await axios.get(`${backendBaseUrl}/user/viewProfile/${friendId}`);
//         setFriend(response.data);
//         console.log(response.data);
//         console.log('reached@');
//       } catch (error) {
//         console.error('Error fetching friend details:', error);
//       }
//     };
  
//     fetchFriend();
//     getdetails();
//     console.log("messages");
//     console.log(messages);
  
  
  
//   }, [friendId, backendBaseUrl]);
 

// const getdetails=async()=>{
//   if(!friend)
//       return;

//   getMessages(friend._id);
    

//   getUserId();
//   getUserData();

//   console.log("socketvaklue");
//   console.log(socket);

//   subscribeToMessages(socket);
//   console.log("user");
//   console.log(user);
//   console.log("this is userid bro");
//   console.log(userId);

//   return () => unsubscribeFromMessages(socket);

// }

//   useEffect(() => {
    
//     getdetails();
    

// },[,friend._id,getMessages,subscribeToMessages,unsubscribeFromMessages]);






// if (!friend) {
//   return <p>Loading...</p>;
// }

//   return (
   
//     <>
//       <div className="p-2.5 border-b border-base-300">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
          
//           <div className="avatar">
//             <div className="size-8  relative">
//                             <img className="rounded-md" src={friend.profilePic === '/images/default_profile.jpeg' ? '/images/default_profile.jpeg' : `${backendBaseUrl}${friend.profilePic}`} alt={friend.fullName} />
              
//             </div>
//           </div>

      
   
//           <div>
//             <h3 className="font-medium text-black-900">{friend.fullname}</h3>
//             <p className="text-sm text-base-content/70">
//               {onlineUsers.includes(friend._id) ? "Online" : "Offline"}
//             </p>
//           </div>
//         </div>

       
//       </div>
//     </div>


//     <div className="flex-1 overflow-y-auto p-4 space-y-4">
//     {messages.map((message) => (
//       <div
//         key={message._id}
//         className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"}`}
//         ref={messageEndRef}
//       >
//         {/* Profile Picture */}
//         <div className="flex-shrink-0">
//           <div className="w-10 h-10 rounded-full border overflow-hidden">
         
//             <img
//   src={
//     message.senderId === userId
//       ? user.profilePic === "/images/default_profile.jpeg"
//         ? "/images/default_profile.jpeg"
//         : user.profilePic
//         ? `${backendBaseUrl}${user.profilePic}`
//         : "/avatar.png"
//       : selectedUser.profilePic === "/images/default_profile.jpeg"
//       ? "/images/default_profile.jpeg"
//       : selectedUser.profilePic
//       ? `${backendBaseUrl}${selectedUser.profilePic}`
//       : "/avatar.png"
//   }
//   alt="profile pic"
// />

//           </div>
//         </div>

//         {/* Message Content */}
//         <div className={`max-w-md ${message.senderId === userId ? "text-right ml-2" : "text-left mr-2"}`}>
//           {/* Message Header */}
//           <div className="mb-1">
//             <time className="text-xs opacity-50">
//               {formatMessageTime(message.createdAt)}
//             </time>
//           </div>

//           {/* Chat Bubble */}
//           <div className={`inline-block bg-primary text-white px-4 py-2 rounded-lg ${message.senderId === userId ? "bg-blue-500 text-white" : "bg-blue-500 text-white"}`}>
            
//             {message.media && (
//                   <>
//                     {message.mediaType === "image" && (
//                       <img
//                         src={message.media}
//                         alt="Attachment"
//                         className="sm:max-w-[200px] rounded-md mb-2"
//                       />
//                     )}
//                     {message.mediaType === "video" && (
//                       <video
//                         src={message.media}
//                         controls
//                         className="sm:max-w-[200px] rounded-md mb-2"
//                       />
//                     )}
//                   </>
//                 )}
//                 {/* Text Message */}
//                 {message.text && <p>{message.text}</p>}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <MessageInput />
    
//     </>
    


//   );
// };

// export default ChatFriend;
