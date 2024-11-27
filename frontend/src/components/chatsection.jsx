// import React, { useState, useEffect } from 'react';

// function ChatApp() {
//   const [searchResults, setSearchResults] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [newMessage, setNewMessage] = useState('');

//   const fetchMessages = async (chat) => {
//     const { userId, friendId, groupId } = chat;
//     const response = await fetch(`/api/messages?userId=${userId}&friendId=${friendId}&groupId=${groupId}`);
//     const data = await response.json();
//     setMessages(data);
//   };

//   const sendMessage = async () => {
//     const response = await fetch('/api/messages', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         sender: currentUserId,
//         receiver: selectedChat.friendId,
//         groupId: selectedChat.groupId,
//         message: newMessage,
//       }),
//     });
//     const data = await response.json();
//     setMessages((prev) => [...prev, data]);
//     setNewMessage('');
//   };

//   return (
//     <div className="chat-app">
//       <div className="sidebar">
//         <input
//           type="text"
//           placeholder="Search users or groups..."
//           onChange={(e) => handleSearch(e.target.value)}
//         />
//         <ul>
//           {searchResults.map((user) => (
//             <li key={user._id} onClick={() => setSelectedChat({ friendId: user._id })}>
//               {user.username}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="chat-window">
//         {selectedChat ? (
//           <>
//             <div className="messages">
//               {messages.map((msg) => (
//                 <div key={msg._id} className={msg.sender === currentUserId ? 'sent' : 'received'}>
//                   {msg.message}
//                 </div>
//               ))}
//             </div>
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//             />
//           </>
//         ) : (
//           <p>Select a chat to start messaging</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default chatsection;