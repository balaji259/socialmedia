import React from 'react';
import {useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import {useSocket} from "./useSocket";
const WelcomeOverlay = () => {

    const navigate=useNavigate();
    const {user, setUser ,socket, connectSocket}= useSocket();
    
    function onRegister(){
        navigate('/register');
    }


    function onLogin(){
        navigate('/login');
    }

    // useEffect(()=>{
    //     connectSocket();
    // },[]);

    return (
        <div className="relative w-screen h-screen flex items-center justify-center bg-gray-800 text-white p-8">
            <div className="max-w-3xl text-center space-y-4">
                <h1 className="text-5xl font-extrabold mb-4 text-purple-400">Friendsbook</h1>
                <p className="text-lg mb-4">
                    Friendsbook is the ultimate college network, connecting you to everyone that matters at MIT University and beyond!
                </p>
                <p className="text-lg mb-6">
                    We’ve opened up Friendsbook to MIT University – a space where every student can share their experiences, connect with friends, and dive into the social scene like never before.
                </p>
                <div className="text-left mb-6 space-y-3 text-lg">
                    <p><span className="font-semibold text-purple-400">Be Yourself:</span> Share your college experiences with the entire campus on Friendsbook.</p>
                    <p><span className="font-semibold text-purple-400">Find Your People:</span> Whether it’s friends, that special someone, or classmates, Friendsbook makes it easy to connect.</p>
                    <p><span className="font-semibold text-purple-400">Make Your Mark:</span> Get social, get noticed, and be unforgettable.</p>
                </div>
                <p className="font-medium mb-6">Ready to join the network?</p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onRegister}
                        className="w-32 px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-full text-lg transition duration-300"
                    >
                        Register
                    </button>
                    <button
                        onClick={onLogin}
                        className="w-32 px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-full text-lg transition duration-300"
                    >
                        Log In
                    </button>
                </div>
                <p className="mt-6 text-sm text-gray-400 italic">
                    A Friendsbook Production | Copyright © 2024
                </p>
            </div>
        </div>
    );
};

export default WelcomeOverlay;
