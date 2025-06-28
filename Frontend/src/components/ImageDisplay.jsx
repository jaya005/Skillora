import React, { useState } from 'react';
import axios from 'axios';

// A simple spinner component
const Spinner = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
);

function ImageDisplay() {
    const [period, setPeriod] = useState('30');
    const [stats, setStats] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const API_URL = `${process.env.REACT_APP_MY_API_BASE}/api/wrapup`; // Your backend URL

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setStats(null);
        setImageUrl('');

        try {
            // Step 1: Get the stats and the new VISUAL prompt from our updated backend
            const statsResponse = await axios.post(`${API_URL}/stats`, { period: parseInt(period) });
            const { stats, prompt } = statsResponse.data;
            
            setStats(stats); // Set stats immediately

            // Step 2: Use the visual prompt to generate the background image
            const imageResponse = await axios.post(
                `${API_URL}/generate-image`,
                { prompt },
                {
                    headers: { 'Accept': 'image/jpeg' },
                    responseType: 'blob'
                }
            );

            const url = URL.createObjectURL(imageResponse.data);
            setImageUrl(url);

        } catch (err) {
            const errorMessage = err.response?.data?.message || "An unknown error occurred.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-8 flex flex-col items-center">
            <div className="w-full max-w-4xl">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400">DevWrap</h1>
                    <p className="text-gray-400 mt-2">The Winning Solution</p>
                </header>

                <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col sm:flex-row items-center gap-4 mb-8">
                     <label htmlFor="period" className="font-semibold">Select Period:</label>
                    <select id="period" value={period} onChange={(e) => setPeriod(e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 flex-grow w-full sm:w-auto">
                        <option value="30">Last 30 Days</option>
                        <option value="365">Last 365 Days</option>
                    </select>
                    <button type="submit" disabled={loading} className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 font-bold py-2 px-6 rounded transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                        {loading ? 'Generating...' : 'Generate Wrap Up'}
                    </button>
                </form>

                {loading && <Spinner />}
                {error && <div className="bg-red-900 border border-red-700 text-red-300 p-4 rounded-lg text-center">{error}</div>}

                {/* ====== THE WINNING HYBRID DISPLAY ====== */}
                {stats && imageUrl && !loading && (
                    <div 
                        className="relative w-full max-w-2xl mx-auto rounded-lg shadow-2xl overflow-hidden aspect-[16/9] bg-gray-700 bg-cover bg-center border-4 border-cyan-600"
                        // The AI image is now the background
                        style={{ backgroundImage: `url(${imageUrl})` }}
                    >
                        {/* A dark overlay ensures text is always readable */}
                        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center p-8 text-center">
                            
                            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                                Your {stats.period == 365 ? 'Yearly' : 'Monthly'} Wrap
                            </h2>

                            {/* This is a container for our perfect, legible text */}
                            <div className="text-xl lg:text-2xl space-y-4 text-left backdrop-blur-sm bg-white/10 p-6 rounded-lg border border-white/20">
                                <p className="flex items-center gap-3">
                                    <span className="text-2xl">🚀</span>
                                    <span><span className="font-bold">{stats.completedProjects}</span> Projects Completed</span>
                                </p>
                                <p className="flex items-center gap-3">
                                    <span className="text-2xl">✔️</span>
                                    <span><span className="font-bold">{stats.completedTasks}</span> Tasks Finished</span>
                                </p>
                                <p className="flex items-center gap-3">
                                    <span className="text-2xl">🧠</span>
                                    <span><span className="font-bold">{stats.completedLearnings}</span> New Skills Gained</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default ImageDisplay;