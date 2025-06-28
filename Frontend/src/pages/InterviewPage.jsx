import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaMicrophone, FaMicrophoneSlash, FaPaperPlane, FaSpinner, FaStopCircle } from 'react-icons/fa';
import useSpeech from '../hooks/useSpeech';

const InterviewPage = () => {
    const { id: interviewId } = useParams();
    const navigate = useNavigate();
    const [conversation, setConversation] = useState([]);
    const [userAnswer, setUserAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isEnding, setIsEnding] = useState(false);
    const chatContainerRef = useRef(null);

    const handleSpeechResult = (transcript) => {
        setUserAnswer(transcript);
        stopListening(); // Stop listening once a final result is received
        handleSubmitAnswer(transcript); // Automatically submit
    };

    const { isListening, startListening, stopListening, speak } = useSpeech(handleSpeechResult);

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                // FIXED: Using a relative path to allow the proxy to work.
                const res = await axios.get(`${process.env.REACT_APP_MY_API_BASE}/api/interview/${interviewId}`);
                setConversation(res.data.conversationHistory);
                
                // Speak the first question (with a safety check)
                if (res.data.conversationHistory && res.data.conversationHistory.length > 0) {
                    speak(res.data.conversationHistory[0].content);
                }
            } catch (error) {
                console.error("Failed to fetch interview", error);
                // Optionally navigate away or show a persistent error message
            } finally {
                setIsLoading(false);
            }
        };
        fetchInterview();
        // The 'speak' function can change identity between renders if not memoized, 
        // it's safer to remove it from the dependency array to prevent re-fetching.
    }, [interviewId]);

    useEffect(() => {
        // Auto-scroll to bottom of chat
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [conversation]);
    
    const handleSubmitAnswer = async (answerText) => {
        const currentAnswer = (answerText || userAnswer).trim();
        if (!currentAnswer) return;

        setUserAnswer('');
        
        // Optimistic UI update for the user's message
        setConversation(prev => [...prev, { role: 'user', content: currentAnswer }]);
        setIsLoading(true);

        try {
            // FIXED: Using a relative path
            const res = await axios.post(`${process.env.REACT_APP_MY_API_BASE}/api/interview/next`, { interviewId, answer: currentAnswer });
            const { nextQuestion } = res.data;
            setConversation(prev => [...prev, { role: 'assistant', content: nextQuestion }]);
            speak(nextQuestion); // Speak the new question
        } catch (error) {
            console.error("Failed to get next question", error);
            setConversation(prev => [...prev, { role: 'assistant', content: "I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleEndInterview = async () => {
        setIsEnding(true);
        try {
            // FIXED: Using a relative path
            await axios.post(`${process.env.REACT_APP_MY_API_BASE}/api/interview/end`, { interviewId });
            navigate(`/feedback/${interviewId}`);
        } catch (error) {
            console.error("Failed to end interview", error);
        } finally {
            setIsEnding(false);
        }
    };
    
    return (
        <div className="flex flex-col h-screen max-h-[90vh] max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h1 className="text-xl font-bold">Interview in Progress</h1>
                <button 
                    onClick={handleEndInterview} 
                    disabled={isEnding || isLoading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2 disabled:bg-red-400">
                    {isEnding ? <FaSpinner className="animate-spin"/> : <FaStopCircle />} End Interview
                </button>
            </div>

            <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-4">
                {conversation.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                            <p className="text-sm">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && conversation.length > 0 && (
                    <div className="flex justify-start">
                        <div className="max-w-lg p-3 rounded-lg bg-gray-700">
                           <FaSpinner className="animate-spin h-5 w-5" />
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-700">
                <div className="flex items-center space-x-2">
                    <button onClick={isListening ? stopListening : startListening} className={`p-3 rounded-full ${isListening ? 'bg-red-500' : 'bg-blue-500'} hover:bg-blue-600`}>
                        {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                    </button>
                    <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                        placeholder={isListening ? 'Listening...' : "Type your answer or use the microphone..."}
                        className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button onClick={() => handleSubmitAnswer()} disabled={isLoading || !userAnswer} className="p-3 bg-green-500 rounded-full hover:bg-green-600 disabled:bg-gray-500">
                        <FaPaperPlane />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewPage;