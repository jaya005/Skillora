import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_MY_API_BASE}/api/wraps`;

function ResultPage() {
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState('Initializing...');
  const [videoUrl, setVideoUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const pollingInterval = useRef(null);

  useEffect(() => {
    // === Step 1: Submit the job ===
    const { formData } = location.state || {};
    if (!formData) {
      navigate('/'); // Redirect home if no data is provided
      return;
    }

    const submitJob = async () => {
      try {
        const { data } = await axios.post(API_URL, formData);
        setJobId(data.jobId);
        setStatus('pending');
      } catch (error) {
        setStatus('failed');
        setErrorMessage(error.response?.data?.message || 'Failed to submit the job.');
      }
    };
    submitJob();
  }, [location.state, navigate]);

  useEffect(() => {
    // === Step 2: Poll for status after getting a job ID ===
    if (!jobId) return;

    pollingInterval.current = setInterval(async () => {
      try {
        const { data } = await axios.get(`${API_URL}/${jobId}/status`);
        setStatus(data.status);

        if (data.status === 'completed') {
          setVideoUrl(data.videoUrl);
          clearInterval(pollingInterval.current);
        }
        if (data.status === 'failed') {
          setErrorMessage(data.failureReason || 'An unknown error occurred during generation.');
          clearInterval(pollingInterval.current);
        }
      } catch (error) {
        setErrorMessage('Could not connect to the server to get status.');
        clearInterval(pollingInterval.current);
      }
    }, 5000); // Poll every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(pollingInterval.current);
  }, [jobId]);

  const renderStatusContent = () => {
    switch (status) {
      case 'pending':
      case 'claimed':
        return <p className="text-lg font-semibold text-blue-700">✅ Your request is in the queue. The AI is warming up...</p>;
      case 'processing':
        return (
          <div className="text-center">
            <p className="text-lg font-semibold text-blue-700">⚙️ Generating video... This may take several minutes.</p>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mt-4"></div>
          </div>
        );
      case 'completed':
        return (
          <div className="text-center w-full">
            <h3 className="text-2xl font-bold text-green-600 mb-4">🎉 Your video is ready!</h3>
            <video src={videoUrl} controls autoPlay muted loop className="w-full max-w-2xl mx-auto rounded-lg mt-4 border-2 border-gray-200 shadow-md"></video>
          </div>
        );
      case 'failed':
        return <p className="text-lg font-semibold text-red-600">❌ Error: {errorMessage}</p>;
      default:
        return <p className="text-lg font-semibold text-gray-600">{status}</p>;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Generation Status</h1>
      </header>
      <main>
        <div className="bg-white p-8 rounded-lg shadow-lg min-h-[300px] flex flex-col justify-center items-center">
          {renderStatusContent()}
          {['completed', 'failed'].includes(status) && (
            <button onClick={() => navigate('/')} className="mt-8 w-auto bg-gray-600 text-white font-bold py-2 px-6 rounded-md hover:bg-gray-700 transition-colors duration-300">
              Create Another Video
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default ResultPage;