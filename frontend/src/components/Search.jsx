import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Search = () => {
    const [query, setQuery] = useState('');
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const backendBaseUrl='http://localhost:7000';

    // Fetch users based on the query and page
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:7000/user/search/suggestions', {
                params: { query, page },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response);

            if (response.data.users.length > 0) {
                setSuggestedUsers(prev => {
                    const newUsers = response.data.users.filter(
                        user => !prev.some(prevUser => prevUser._id === user._id)
                    );
                    return [...prev, ...newUsers];
                });
            } else {
                setHasMore(false); // No more users to load
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Fetch initial users or search when query changes
    useEffect(() => {
        setSuggestedUsers([]);
        setPage(1);
        setHasMore(true);
        fetchUsers();
    }, [query]);

    // Infinite scroll functionality
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

    // Fetch more users when page changes
    useEffect(() => {
        if (page > 1) fetchUsers();
    }, [page]);

    return (
        <div className="w-full max-w-5xl mx-auto p-6 bg-gray-200">
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {suggestedUsers.map((user) => (
                    <div key={user._id} className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <img src={user.profilePic==='/images/default_profile.jpeg'?'/images/default_profile.jpeg':`${backendBaseUrl}${user.profilePic}`} alt={user.username} className="w-20 h-20 mx-auto rounded-full" />
                        <div className="text-center mt-3">
                            <h3 className="text-lg font-semibold">{user.username}</h3>
                            <p className="text-sm text-gray-500">{user.bio}</p>
                        </div>
                        <div className="flex justify-between mt-4">
                            <button className="bg-blue-500 text-white px-5 py-1 rounded-lg hover:bg-blue-600">Follow</button>
                            <button className="bg-yellow-400 text-white px-5 py-1 rounded-lg hover:bg-yellow-500">Chat</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Search;
