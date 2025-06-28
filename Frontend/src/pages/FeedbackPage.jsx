import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaExclamationTriangle, FaTrophy, FaRedo, FaSpinner } from 'react-icons/fa';

const FeedbackPage = () => {
    const { id: interviewId } = useParams();
    const [feedback, setFeedback] = useState(null);
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_MY_API_BASE}/api/interview/${interviewId}`);
                if (!res.data.feedback || !res.data.score) {
                    setError("Feedback is not yet available for this session.");
                } else {
                    setFeedback(JSON.parse(res.data.feedback));
                    setScore(res.data.score);
                }
            } catch (err) {
                setError("Could not retrieve interview feedback.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedback();
    }, [interviewId]);

    if (loading) {
        return <div className="text-center mt-20"><FaSpinner className="animate-spin h-10 w-10 mx-auto" /></div>;
    }

    if (error) {
        return <div className="text-center mt-20 text-red-400">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-8 bg-gray-800 rounded-lg shadow-2xl mt-10">
            <h1 className="text-4xl font-extrabold text-center mb-4 text-blue-300">Interview Feedback</h1>
            <p className="text-center text-gray-400 mb-8">Here's a breakdown of your performance.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="col-span-1 md:col-span-2 space-y-6">
                    <div className="bg-gray-700 p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-3 flex items-center gap-2 text-green-400"><FaCheckCircle /> Strengths</h2>
                        <p className="text-gray-300 whitespace-pre-wrap">{feedback?.strengths || "No specific strengths identified."}</p>
                    </div>
                    <div className="bg-gray-700 p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-3 flex items-center gap-2 text-yellow-400"><FaExclamationTriangle /> Areas for Improvement</h2>
                        <p className="text-gray-300 whitespace-pre-wrap">{feedback?.improvements || "No specific areas for improvement identified."}</p>
                    </div>
                </div>
                <div className="bg-gray-700 p-6 rounded-lg flex flex-col items-center justify-center text-center">
                    <FaTrophy className="text-7xl text-yellow-400 mb-4" />
                    <h2 className="text-2xl font-bold">Overall Score</h2>
                    <p className="text-6xl font-extrabold text-blue-400 my-2">{score}<span className="text-3xl text-gray-400">/10</span></p>
                    <div className="w-full bg-gray-600 rounded-full h-4 mt-4">
                        <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${score * 10}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="text-center mt-10">
                <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold">
                    <FaRedo /> Try Another Interview
                </Link>
            </div>
        </div>
    );
};

export default FeedbackPage;