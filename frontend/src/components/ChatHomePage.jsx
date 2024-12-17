import {useChatStore} from './useChatStore';
import {useEffect} from "react";
import NoChatSelected from "./skeletons/NoChatSelected";
import Sidebar from "./Sidebar";
import ChatContainer from "./ChatContainer";
import axios from "axios";
import { useSocket } from './useSocket';

const ChatHomePage=()=>{
    const {selectedUser} = useChatStore();
    const {user,setUser,socket,connectSocket}= useSocket();
    const backendBaseUrl='http://localhost:7000';
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
            <div className="flex items-center justify-center pt-20 px-4">
                <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        <Sidebar />

                        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}




                    </div>
                </div>
            </div>


        </div>
    )
}

export default ChatHomePage;