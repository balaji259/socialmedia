// Routes.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';  // Adjust the path as needed
import Logo from './components/Logo';  // Adjust the path as needed
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import SuggestionSidebar from './components/Suggestions';
import PostComponent from './components/Posts';
import ReportPost from './components/Report';
import SinglePost from './components/SinglePost';
import Home from "./components/Home";
import UserDetails from "./components/Details";
import Profile from "./components/Profile";
import UserProfile from "./components/CheckProfile.jsx"; 
import Search from "./components/Search";
import Register from './components/Register';
import Login from './components/Login';
import SearchSuggestions from './components/SearchSuggestions';
import WelcomeOverlay from './components/Welcome';
import Sidebar from "./components/Sidebar.jsx";
import ChatHomePage from "./components/ChatHomePage.jsx";
import Friends from "./components/Friends.jsx";
import FriendList from "./components/FetchFriends";
// import chatsection from './components/chatsection'
import { SocketProvider } from "./components/useSocket";
// import ChatFriend from "./components/ChatFriend";
import NewProfile from './components/NewProfile.jsx';
import EditProfile from "./components/EditNewProfile.jsx";
import NewPosts from "./components/NewPosts.jsx";
import OtherProfile from "./components/OtherProfile.jsx";
import OtherPosts from "./components/OtherPosts.jsx";

const RoutesComponent = () => {
    return (
        <SocketProvider>
        <Router>
            <Routes>
                <Route path="/" element={<WelcomeOverlay />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth" element={<App />} />
                <Route path="/logo" element={<Logo />} />
                <Route path="/navbar" element={<Navbar />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/suggestions" element={<SuggestionSidebar/>} />
                <Route path="/posts" element={<PostComponent />} />
                <Route path="/home" element={<Home />} />
                <Route path="/report" element={<ReportPost />} />
                <Route path="/posts/:postId" element={<SinglePost />} />
                <Route path="/details" element={<UserDetails />} />
                <Route path="/profile" element={<NewProfile />} />
                <Route path="/edit" element={<EditProfile />} />
                <Route path="/profile/:userId" element={<UserProfile />} /> 
                <Route path="/search" element={<Search />} />
                <Route path="/searchsug" element={<SearchSuggestions />} />
                <Route path="/chat/sidebar" element={<Sidebar />} />
                <Route path="/chats" element={<ChatHomePage />} />
                <Route path="/friends" element={<Friends /> } />
                <Route path="/friendlist" element={<FriendList />} />
                <Route path="/newposts" element={<NewPosts /> } />
                <Route path="/other/:userId" element={<OtherProfile />} />
                <Route path="/viewposts/:userId" element={<OtherPosts />} />
                {/* <Route path="/chat/:friendId" element={<ChatFriend /> } /> */}
                {/* <Route path='./chat' element={<chatsection />} />             */}
            </Routes>
        </Router>
        </SocketProvider>
    );
};

export default RoutesComponent;
