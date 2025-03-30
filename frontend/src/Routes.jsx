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
import FeedbackForm from './components/Feedback.jsx';
import NewFeedbackForm from './components/NewFeedback.jsx';
import About from "./components/About.jsx"
import Blog from "./components/Blog.jsx"
import NewLogin from "./components/Newlogin.jsx"
import FAQ from "./components/Faq.jsx"
import Coming from "./components/Comingsoon.jsx";
import Notifications from './components/Notifications.jsx'; 
import Updates from "./components/Updates.jsx"

import Fest from "./components/Fest";

import HolyBanner from "./components/Holy";
import Groups from "./components/Groups";
import Communities from "./components/Communities";
import Community from "./components/Community.jsx";

import Create from "./components/Create.jsx"
import CreateGroup from "./components/Creategroup.jsx";
import CreateCommunity from "./components/CreateCommunity.jsx";

import Group from "./components/Group.jsx";

const RoutesComponent = () => {
    return (
        <SocketProvider>
        <Router>
            <Routes>
                <Route path="/" element={<NewLogin />} />
                <Route path="/welcome" element={<WelcomeOverlay />} />
                {/* <Route path="/register" element={<Register />} /> */}
                {/* <Route path="/login" element={<Login />} /> */}
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
                {/* <Route path="/search" element={<Search />} /> */}
                <Route path="/search" element={<Updates />} />
                <Route path="/searchsug" element={<SearchSuggestions />} />
                <Route path="/chat/sidebar" element={<Sidebar />} />
                <Route path="/chats" element={<ChatHomePage />} />
                <Route path="/friends" element={<Friends /> } />
                {/* <Route path="/friends" element={<Updates /> } /> */}
                <Route path="/friendlist" element={<FriendList />} />
                <Route path="/newposts" element={<NewPosts /> } />

                <Route path="/other" element={<OtherProfile />} />
                <Route path="/viewposts" element={<OtherPosts />} />

                <Route path="/feedback" element={<NewFeedbackForm />} />
                <Route path="/about" element={<About />} />

                <Route path="/blog" element={<Blog />} />
                <Route path="/newlogin" element={<NewLogin />} />
                
                
                <Route path="/faq" element={<FAQ /> }/>
                <Route path="/contact" element={<NewFeedbackForm /> } />
                

                <Route path="/update" element={<Updates />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/fest" element={<Fest />} />
                <Route path="/holy" element={<HolyBanner />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/communities" element={<Communities />} />

                <Route path="/create" element={<Create />} /> 
                <Route path="/cgroup" element={<CreateGroup />} />

                <Route path="/ccom" element={<CreateCommunity />} />

                <Route path="/group/:id" element={<Group />} />
                <Route path="/community/:id" element={<Community />} />

            </Routes>
        </Router>
        </SocketProvider>
    );
};

export default RoutesComponent;
