import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
// import { useSocketStore } from './useSocket';

const Register = ({ onSwitch }) => {
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpValidated, setIsOtpValidated] = useState(false);

    const navigate = useNavigate();

    // Function to handle registration and send OTP
    const handleSendOtp = (e) => {
        e.preventDefault();
        console.log('Register button clicked! Sending OTP...');
        axios.post('http://localhost:7000/user/send-otp', { email })
            .then((res) => {
                toast.success('OTP sent to your email!', { duration: 2000 });
                setIsOtpSent(true); // Show the OTP input
            })
            .catch((err) => {
                const errorMessage = err.response?.data?.error || 'Failed to send OTP';
                toast.error(errorMessage, { duration: 2000 });
            });
    };

    // Function to validate OTP
    const handleValidateOtp = (e) => {
        e.preventDefault();
        console.log('Validating OTP...');
        axios.post('http://localhost:7000/user/validate-otp', { email, otp })
            .then((res) => {
                toast.success('OTP validated successfully!', { duration: 2000 });
                setIsOtpValidated(true); // Allow registration to proceed
                handleSubmit(); // Submit the registration
            })
            .catch((err) => {
                const errorMessage = err.response?.data?.error || 'Invalid OTP';
                toast.error(errorMessage, { duration: 2000 });
            });
    };

    // Function to handle registration
    const handleSubmit = () => {
        try{
        console.log('Completing registration...');
        //zustand
        set({ isSigningUp: true });
        axios.post('http://localhost:7000/user/register', { username, fullname, email, password })
            .then((res) => {
                const token = res.data.token;
                localStorage.setItem('token', token);
                // set({ authUser: res.data });
                toast.success('User registered successfully!', { duration: 2000 });
                // get().connectSocket();
                // setUser(response.data.payload);
                // connectSocket();
                    

                setTimeout(() => {
                    navigate('/logo'); // Redirect to Logo page
                }, 1000);
            })
            .catch((err) => {
                const errorMessage = err.response?.data?.error || 'Registration failed';
                toast.error(errorMessage, { duration: 2000 });
            })
        }
        catch(e){
            console.log(e);
        }
        finally{
            // set({ isSigningUp: false });
        }

    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 via-teal-400 to-yellow-200">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                <h2 className="text-2xl font-semibold mb-4">Create an Account</h2>

                {!isOtpSent ? (
                    // Registration Form
                    <form onSubmit={handleSendOtp} className="flex flex-col">
                        <input 
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required
                            className="p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                        <input
                            type="text"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            placeholder="Full Name"
                            required
                            className="p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
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
                            Register
                        </button>
                    </form>
                ) : !isOtpValidated ? (
                    // OTP Validation Form
                    <form onSubmit={handleValidateOtp} className="flex flex-col">
                        <h3 className="text-xl font-semibold mb-4">Enter the OTP sent to your email</h3>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            required
                            className="p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                        <button
                            type="submit"
                            className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                        >
                            Validate OTP
                        </button>
                    </form>
                ) : (
                    <p>Redirecting to home...</p>
                )}

                <div className="mt-4 text-sm">
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
