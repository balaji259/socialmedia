import React, { useState } from 'react';
import axios from 'axios';
// import { create } from "zustand";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { GoogleLogin } from "@react-oauth/google";
import  {jwtDecode}  from "jwt-decode";
import {useSocket} from "./useSocket";
// import { useSocketStore } from "./useSocket";


// const [user,setUser]=useState(null);



const Login = ({ onSwitch }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    // const {isLogin,setIsLogin}=useState();
    // const {user, setUser ,socket, connectSocket,isLogin,setIsLogin}= useSocket();

    // const { connectSocket, setAuthUser, isLoggingIn, setIsLoggingIn } = useSocketStore(
    //     (state) => ({
    //       connectSocket: state.connectSocket,
    //       setAuthUser: state.setAuthUser,
    //       isLoggingIn: state.isLoggingIn,
    //       setIsLoggingIn: state.setIsLoggingIn,
    //     })
    //   );
    
    const {user, setUser ,socket, connectSocket}= useSocket();
    
        const handleSubmit = (e) => {
         
            e.preventDefault();
           
        axios.post("http://localhost:7000/user/login", { email, password })
            .then((response) => {
                const token = response.data.token;
                localStorage.setItem('token', token);
                
                setUser(response.data.payload);
                // console.log("user",user);
                console.log(response.data.payload);
                toast.success('Login Successful', { duration: 2000 });
 
               

                // connectSocket();
                setTimeout(() => {
                    connectSocket();
                    navigate('/home');
                }, 1000);
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.error || 'Login failed: Server error.';
                toast.error(errorMessage, { duration: 2000 });
            })
            .finally(() => {
                // setIsLoggingIn(false);
            });
    }

        

    const handleGoogleLogin = async (x) => {
        
            console.log(x.email);
            axios.post("http://localhost:7000/user/login", { email: x.email })
                .then((response) => {
                    const token = response.data.token;
                    localStorage.setItem('token', token);
                    toast.success('Login Successful', { duration: 2000 });
                    
                    // setUser(response.data.payload);
                   
                    // setAuthUser(response.data.payload);
                    // set({ authUser: response.data.payload }); // Update Zustand store
                    
                    setUser(response.data.payload);
                    // connectSocket();
                    setTimeout(() => {
                        // connectSocket();
                        navigate('/home');
                    }, 1000);
                })
                .catch((error) => {
                    const errorMessage = error.response?.data?.error || 'Login failed: Server error.';
                    toast.error(errorMessage, { duration: 2000 });
                });
         
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 via-teal-400 to-yellow-200 px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                <img src="/images/logo.jpeg" alt="Organization Logo" className="w-32 md:w-40 mb-4 mx-auto" />
                <h2 className="text-xl md:text-2xl font-semibold mb-4">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        required
                        className="p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                    <button
                        type="submit"
                        className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-sm">
                    Don't have an account?{" "}
                    <span
                        onClick={() => navigate('/register')}
                        className="text-purple-600 cursor-pointer"
                    >
                        Register here
                    </span>
                </div>

                {/* Google Login */}
                <div className="flex items-center justify-center mt-5">
                    <div>
                        <GoogleLogin
                            onSuccess={(res) => {
                                let x = jwtDecode(res?.credential);
                                handleGoogleLogin(x);
                            }}
                            onError={(err) => {
                                console.log(err, "Login Failed");
                            }}
                        />
                        <p className="text-gray-700 mt-4">Sign in with Google</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Login;
