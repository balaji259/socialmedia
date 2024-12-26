import {useChatStore} from './useChatStore';
import {useEffect} from "react";
import NoChatSelected from "./skeletons/NoChatSelected";
import Sidebar from "./Sidebar";
import ChatContainer from "./ChatContainer";
import axios from "axios";
import { useSocket } from './useSocket';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from "react-icons/fi";
const ChatHomePage=()=>{
    const {selectedUser,resetState} = useChatStore();
    const {user,setUser,socket,connectSocket}= useSocket();
    const backendBaseUrl='http://localhost:7000';
    const navigate = useNavigate();
    async function getUser(){
        try{
            const token=localStorage.getItem("token");
            const res=await axios.get(`${backendBaseUrl}/user/getUser`,{
                headers: {
                    Authorization:`Bearer ${token}`,
                },

            })
            // console.log("get userdetails request this");
            // console.log(res);
            console.log(res.data);
            setUser(res.data);
        }
        catch(e){
            console.log(e);
        }
    }

    useEffect(()=>{
    
        console.log("loading chat hom page!");
        getUser();
    },[]);

    return(
        <div className="h-screen bg-base-200">
            {/* //added  */}

            <div className="absolute top-4 left-4">
                <button
                    className="btn btn-ghost btn-circle text-error"
                    onClick={() => navigate('/home')} // Replace with the desired route
                >
                    <FiLogOut size={25}   style={{ transform: 'scaleX(-1)' }}/> {/* Icon with size */}
                </button>
            </div>

            {/* //added */}
            <div className="flex items-center justify-center pt-20 px-4">
                <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        <Sidebar/>

                        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}




                    </div>
                </div>
            </div>


        </div>
    )
}

export default ChatHomePage;