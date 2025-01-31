import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ReportPost = () => {
    const [userId, setUserId] = useState("");
    const [postId, setPostId] = useState("");
    const [reason, setReason] = useState("");
    const backendBaseUrl = 'http://localhost:7000';
    const renderurl="https://socialmedia-backend-2njs.onrender.com";
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setPostId(urlParams.get("postId") || "");
        setUserId(urlParams.get("userId") || "");
    }, []);

    const handleReportSubmit = async (event) => {
        event.preventDefault();

        const reportData = { userId, postId, reason };
        console.log(reportData);

        try {
            const response = await fetch(`/posts/report`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reportData),
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Report submitted successfully!",{duration:2500});
                
                setTimeout(()=>{navigate('/home');},3000);
                // window.location.href = "home.html"; // Redirect back to posts page
            } else {
                toast.error("Failed to submit report. Please try again.",{duration:2500});
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred. Please try again later.",{duration:2500});
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-cyan-500 to-yellow-200 p-5">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Report Post</h2>
                <form onSubmit={handleReportSubmit} className="flex flex-col">
                    <input type="hidden" value={userId} />
                    <input type="hidden" value={postId} />
                    
                    <label htmlFor="reason" className="text-lg font-medium text-gray-700 mb-2">Reason for Reporting:</label>
                    <textarea
                        id="reason"
                        name="reason"
                        placeholder="Describe why you're reporting this post..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        className="resize-y p-3 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-4 min-h-[100px]"
                    />
                    
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Submit Report
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReportPost;
