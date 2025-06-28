'use client';

import { useState } from 'react';
import axios from 'axios';

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { from: 'them', text: 'Hey! Great to connect with you here.' },
    { from: 'me', text: 'Likewise! Looking forward to collaborating.' },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    setMessages([...messages, { from: 'me', text: inputMessage.trim() }]);
    setInputMessage('');
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_MY_API_BASE}/api/genai`, {
        prompt: aiPrompt,
        tone: 'Professional',
        type: 'Message',
      });
      setInputMessage(response.data.generated);
    } catch (err) {
      console.error(err);
      alert('AI generation failed.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-lg w-full max-w-md min-h-[24rem] max-h-[80vh] flex flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[75%] px-4 py-2 rounded-xl text-sm whitespace-pre-wrap ${
              msg.from === 'me'
                ? 'ml-auto bg-blue-600 text-white'
                : 'mr-auto bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="border-t border-gray-300 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>

        {/* GenAI Suggestion */}
        <div className="mt-3">
          <h3 className="text-sm font-medium mb-1">Need help writing?</h3>
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Describe what you want to say..."
            className="w-full h-20 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white mb-2"
          ></textarea>
          <button
            onClick={generateWithAI}
            disabled={aiLoading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 w-full"
          >
            {aiLoading ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>
      </div>
    </div>
  );
}
