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

const RoutesComponent = () => {
    return (
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
                <Route path="/profile" element={<Profile />} />
                <Route path="/search" element={<Search />} />
                <Route path="/searchsug" element={<SearchSuggestions />} />
                <Route path="/chat/sidebar" element={<Sidebar />} />
                <Route path="/chat/page" element={<ChatHomePage />} />
                <Route path="/friends" element={<Friends /> } />
                <Route path="/friendlist" element={<FriendList />} />
                {/* <Route path='./chat' element={<chatsection />} />             */}
            </Routes>
        </Router>
    );
};

export default RoutesComponent;
