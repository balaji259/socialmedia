// Routes.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';  // Adjust the path as needed
import Logo from './components/Logo';  // Adjust the path as needed
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import SuggestionSidebar from './components/Suggestions';
import PostComponent from './components/Posts';
import Home from "./components/Home"

const RoutesComponent = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/logo" element={<Logo />} />
                <Route path="/navbar" element={<Navbar />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/suggestions" element={<SuggestionSidebar/>} />
                <Route path="/posts" element={<PostComponent />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </Router>
    );
};

export default RoutesComponent;
