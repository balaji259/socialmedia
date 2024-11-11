import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchSuggestions = () => {
    const [query, setQuery] = useState('');
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const backendBaseUrl = 'http://localhost:7000';

    // Helper function to decode JWT and extract userId
    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.userId;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    const currentUserId = getUserIdFromToken();
    console.log(`currentuserid: ${currentUserId}`);

    // Fetch users based on the query and page
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${backendBaseUrl}/user/search/suggestions`, {
                params: { query, page },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.users.length > 0) {
                setSuggestedUsers(prev => {
                    const newUsers = response.data.users.filter(
                        user => !prev.some(prevUser => prevUser._id === user._id)
                    );
                    return [...prev, ...newUsers];
                });
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Function to handle follow action
    const handleFollow = async (followId) => {
        try {
            const token = localStorage.getItem('token');
            console.log(currentUserId);
            console.log(followId);
            await axios.post(
                `${backendBaseUrl}/user/search/follow`,
                { userId: currentUserId, followId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update the suggestedUsers list by removing the followed user
            setSuggestedUsers(prev => prev.filter(user => user._id !== followId));
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    useEffect(() => {
        setSuggestedUsers([]);
        setPage(1);
        setHasMore(true);
        fetchUsers();
    }, [query]);

    useEffect(() => {
        if (!hasMore) return;
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
                setPage(prev => prev + 1);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore]);

    useEffect(() => {
        if (page > 1) fetchUsers();
    }, [page]);

    return (
        <div className="w-full max-w-4xl mx-auto p-8 bg-gray-100 min-h-screen">
            <div className="relative mb-8">
                <input
                    type="text"
                    placeholder="Search for users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full p-4 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out shadow-sm"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {suggestedUsers.map((user) => (
                    <div key={user._id} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                        <img
                            src={user.profilePic === '/images/default_profile.jpeg' ? '/images/default_profile.jpeg' : `${backendBaseUrl}${user.profilePic}`}
                            alt={user.username}
                            className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-blue-500"
                        />
                        <div className="text-center mt-4">
                            <h3 className="text-xl font-semibold text-gray-800">{user.username}</h3>
                            <p className="text-gray-600 mt-1">{user.bio}</p>
                        </div>
                        <div className="flex justify-center mt-6 space-x-4">
                            <button
                                onClick={() => handleFollow(user._id)}
                                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition duration-200"
                            >
                                Follow
                            </button>
                            <button className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-full shadow-md hover:bg-yellow-600 transition duration-200">Chat</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchSuggestions;
