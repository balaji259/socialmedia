import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';


const Register = ({ onSwitch }) => {
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [toast, setToast] = useState('');
    
    const navigate = useNavigate(); // Move this inside the component
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("clicked!");
        axios.post('http://localhost:7000/user/register', { username, fullname, email, password })
            .then((res) => {
                const token = res.data.token;
                localStorage.setItem('token', token);
                toast.success("User registered successfully!",{duration:2000});
                setTimeout(() => {
                    navigate('/logo'); // Redirect to the Logo component
                    // window.location.href="./Logo.jsx"
                }, 1000);
            })
            .catch((err) => {
                const errorMessage = err.response?.data?.error || 'Registration failed';
                toast.error(errorMessage,{duration:2000});
            });
    };

    // const showToast = (message) => {
    //     setToast(message);
    //     setTimeout(() => setToast(''), 3000);
    // };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 via-teal-400 to-yellow-200">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                <h2 className="text-2xl font-semibold mb-4">Create an Account</h2>
                <form onSubmit={handleSubmit} className="flex flex-col">
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
                <div className="mt-4 text-sm">
                    Already have an account? <span onClick={onSwitch} className="text-purple-600 cursor-pointer">Login here</span>
                </div>
                {/* {toast && <div className="mt-4 text-red-600">{toast}</div>} */}
            </div>
        </div>
    );
};

export default Register;
