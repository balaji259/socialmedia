import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import  {jwtDecode}  from "jwt-decode";
import {useSocket} from "./useSocket";

const NewLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    gender: "",
    birthday: {
      month: "",
      day: "",
      year: "",
    },
  });

  const [loginemail,setLoginemail]=useState("");
  const [loginpassword,setLoginpassword]=useState("");

  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {user, setUser ,socket, connectSocket}= useSocket();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle date selection
  const handleDateChange = (key, value) => {
    setFormData({
      ...formData,
      birthday: { ...formData.birthday, [key]: value },
    });
  };

  // Handle sending OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/user/check-email", { email: formData.email });

      if (data.exists) {
        toast.error("Email already exists!");
        setLoading(false);
        return;
      }

      await axios.post("/user/send-otp", { email: formData.email });
      toast.success("OTP sent to your email!");
      setIsOtpSent(true);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP validation and final registration
  const handleValidateOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/user/validate-otp", { email: formData.email, otp });
      toast.success("OTP validated successfully!");
      await handleRegister();
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle registration after OTP verification
  const handleRegister = async () => {
    setLoading(true);
    try {
      const birthday = `${formData.birthday.day}-${formData.birthday.month}-${formData.birthday.year}`;
      const { data } = await axios.post("/user/newregister", { ...formData, birthday });

      localStorage.setItem("token", data.token);
      toast.success("User registered successfully!");
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = () => {
         
    // e.preventDefault();
   console.log(loginemail);
   console.log(loginpassword);
axios.post(`/user/login`, { email:loginemail, password:loginpassword })
    .then((response) => {
        const token = response.data.token;
        localStorage.setItem('token', token);
        
        setUser(response.data.payload);
        
        toast.success('Login Successful', { duration: 2000 });

       

        // connectSocket();
        setTimeout(() => {
            connectSocket();
            navigate('/home');
        }, 1000);
    })
    .catch((error) => {
        console.log(error.message);
        const errorMessage = error?.message;
        toast.error(error);
    })
    .finally(() => {
        // setIsLoggingIn(false);
    });
}

const checkUser=async ()=>{
  const token=localStorage.getItem("token");
  if(token){
      axios.get(`/verify`,{
          headers: {Authorization:`Bearer ${token}` },
      })
      .then((res)=> {
          // setUser(res.data.user);
          navigate('/home');
          console.log("success");
      })
      .catch((e) => {
          // setUser(null);
      
          localStorage.removeItem('token');
      })
      
  }
  else{
      console.log("no token");
  }
}

  useEffect(()=>{
      checkUser();
  },[])


  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {loading ? (
        // <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-md text-center">
        // <div className="flex justify-center">
        //   <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-600"></div>
        // </div>
        // </div>
        <div className="flex flex-1 items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-600"></div>
      </div>
      ) : isOtpSent ? (
        <div className="flex flex-1 items-center justify-center">

        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-md text-center">
        <form onSubmit={handleValidateOtp} className="flex flex-col">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">
            Enter the OTP sent to your email
          </h3>
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
        </div>
        </div>
      ) : (
        <>
          {/* Navbar */}
          <nav className="bg-[#3b5998] text-white py-3 px-4 md:px-6 flex flex-wrap justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold">friendsbook</h1>
            <div className="flex flex-wrap md:flex-nowrap items-center w-full md:w-auto justify-center md:justify-end mt-2 md:mt-0 space-x-1 md:space-x-2">
              <input
                type="text"
                placeholder="Email"
                value={loginemail}
                required
                onChange={(e) => setLoginemail(e.target.value)}
                className="p-1 rounded text-black w-[35%] min-w-[100px] text-sm md:text-base"
              />
              <input
                type="password"
                value={loginpassword}
                placeholder="Password"
                required
                onChange={(e) => setLoginpassword(e.target.value)}
                className="p-1 rounded text-black w-[35%] min-w-[100px] text-sm md:text-base"
              />
              <button onClick={handleSubmit} className="border border-black bg-[#3b5998] px-3 py-1 rounded text-sm md:text-base w-[20%] min-w-[60px]">
                Login
              </button>
            </div>
          </nav>
  
          {/* Main Section */}
          <main className="flex flex-col md:flex-row flex-grow p-4 md:p-6 bg-gray-100">
            {/* Left Content */}
            <div className="md:w-1/2 space-y-4 text-center md:text-left">
              <h2 className="text-lg md:text-xl font-semibold text-[#3b5998]">
                Friendsbook helps you connect and share with the people in your life.
              </h2>
              {/* <img
                src="/images/map.jpg" // Replace with actual image
                alt="World map with connected people icons"
                className="mx-auto md:mx-0 max-w-full"
              /> */}
              <img
              src="/images/map.jpg"
              alt="World map with connected people icons"
              // className="mx-auto md:mx-0 max-w-full md:scale-110 lg:scale-125"
              className="mx-auto md:mx-0 max-w-full  md:scale-110 lg:scale-120 lg:pl-6 lg:pt-4"
            />
            </div>
  
            {/* Signup Form */}
            <div className="border-none w-full md:w-1/2 bg-transparent p-4 md:p-6   max-w-md mx-auto mt-4 md:mt-0">
              <h3 className="text-lg  text-[#3b5998] font-semibold ">Sign Up</h3>
              <p className="text-gray-400 mb-4">It's free and anyone can join</p>
              <input
                type="text"
                name="username"
                placeholder="User Name"
                value={formData.username}
                onChange={handleChange}
                className="w-full mb-2 p-2 border rounded text-sm md:text-base"
              />
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full mb-2 p-2 border rounded text-sm md:text-base"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mb-2 p-2 border rounded text-sm md:text-base"
              />
              <input
                type="password"
                name="password"
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mb-2 p-2 border rounded text-sm md:text-base"
              />
  
              <div className="flex justify-between mb-2">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="p-2 border rounded w-full text-sm md:text-base"
                >
                  <option value="">Select Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
  
              <div className="flex space-x-2 mb-4">
                {/* Month Selector */}
                <select
                  value={formData.birthday.month}
                  className="p-2 border rounded flex-1 text-sm md:text-base"
                  onChange={(e) => handleDateChange("month", e.target.value)}
                >
                  <option value="">Month</option>
                  {months.map((month, index) => (
                    <option key={index} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
  
                {/* Day Selector */}
                <select
                  value={formData.birthday.day}
                  className="p-2 border rounded flex-1 text-sm md:text-base"
                  onChange={(e) => handleDateChange("day", e.target.value)}
                >
                  <option value="">Day</option>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
  
                {/* Year Selector */}
                <select
                  value={formData.birthday.year}
                  className="p-2 border rounded flex-1 text-sm md:text-base"
                  onChange={(e) => handleDateChange("year", e.target.value)}
                >
                  <option value="">Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
  
              <button
                onClick={handleSendOtp}
                className="w-full bg-green-600 text-white py-2 rounded text-sm md:text-base"
              >
                Sign Up
              </button>
              <p className="mt-2 text-gray-400">
                By clicking Sign Up, you are indicating that you have read and agree to the Terms of Use and Privacy Policy.
              </p>
            </div>
          </main>
  
          {/* Footer */}
          <footer className="bg-white text-center py-3 text-sm">
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-[#3b5998]">
              <p className="cursor-pointer" onClick={()=>{navigate('/about')}}>About</p>
              <p className="cursor-pointer" onClick={()=>{navigate('/contact')}}>Contact</p>
              <p className="cursor-pointer" onClick={()=>{navigate('/faq')}}>FAQ</p>
              <p className="cursor-pointer" onClick={()=>{navigate('/blog')}}>Blogs</p>
            </div>
            <p className="text-gray-400 mt-2">
              A Friendsbook Production | Copyright © 2024
            </p>
          </footer>
        </>
      )}
    </div>
  );
  
};

export default NewLogin;
