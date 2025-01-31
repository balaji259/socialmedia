import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useSocket } from './useSocket';

const Register = () => {
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const backendBaseUrl = 'http://localhost:7000';
    const renderurl="https://socialmedia-backend-2njs.onrender.com";
    const { setUser, connectSocket } = useSocket();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`/user/check-email`, { email });
            if (data.exists) {
                toast.error('Email already exists!');
                return;
            }
            await axios.post(`/user/send-otp`, { email });
            toast.success('OTP sent to your email!');
            setIsOtpSent(true);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleValidateOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`/user/validate-otp`, { email, otp });
            toast.success('OTP validated successfully!');
            await handleRegister();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post(`/user/register`, {
                username,
                fullname,
                email,
                password,
            });
            localStorage.setItem('token', data.token);
            setUser(data.payload);
            connectSocket();
            toast.success('User registered successfully!');
            navigate('/logo');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 via-teal-400 to-yellow-200">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-md text-center">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">Create an Account</h2>
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-purple-600"></div>
                    </div>
                ) : isOtpSent ? (
                    <form onSubmit={handleValidateOtp} className="flex flex-col">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4">Enter the OTP sent to your email</h3>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            required
                            className="p-2 sm:p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                        <button
                            type="submit"
                            className="p-2 sm:p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                        >
                            Validate OTP
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSendOtp} className="flex flex-col">
                        {/* <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required
                            className="p-2 sm:p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        /> */}

<div className="flex item-start">
                        <span style={{ color: "red", fontSize: "12px", marginBottom: "4px" }}>
                            *Username cannot be changed later!
                        </span>
                        </div>
                       

                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required
                            className="p-2 sm:p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                       
                        <input
                            type="text"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            placeholder="Full Name"
                            required
                            className="p-2 sm:p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            required
                            className="p-2 sm:p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="p-2 sm:p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                        <button
                            type="submit"
                            className="p-2 sm:p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
                        >
                            Register
                        </button>
                    </form>
                )}
                <div className="mt-4 text-xs sm:text-sm">
                    Already have an account?{' '}
                    <span
                        onClick={() => navigate('/login')}
                        className="text-purple-600 cursor-pointer"
                    >
                        Login here
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Register;
