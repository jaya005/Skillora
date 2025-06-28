'use client';

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AIToolsPage() {
  const [activeTool, setActiveTool] = useState('interview');
  const [bioPrompt, setBioPrompt] = useState('');
  const [bioTone, setBioTone] = useState('Professional');
  const [bioOutput, setBioOutput] = useState('');
  const [bioLoading, setBioLoading] = useState(false);

  const [postPrompt, setPostPrompt] = useState('');
  const [postTone, setPostTone] = useState('Motivational');
  const [postOutput, setPostOutput] = useState('');
  const [postLoading, setPostLoading] = useState(false);

  const [goal, setGoal] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const navigate = useNavigate();

  const tools = [
    {
      id: 'interview',
      name: 'Interview with AI',
      description: 'Prepare for upcoming interviews with AI.',
      icon: '🤖',
    },
    {
      id: 'path',
      name: 'Learning Path Builder',
      description: 'Create a customized learning path based on your goals.',
      icon: '🗺️',
    },
    {
      id: 'bio',
      name: 'Bio Generator',
      description: 'Generate an engaging professional bio for your profile.',
      icon: '👤',
    },
    {
      id: 'post',
      name: 'Post Generator',
      description: 'Write a compelling collaboration or achievement post.',
      icon: '📢',
    }
  ];

  const generateContent = async (type, prompt, tone, setOutput, setLoading) => {
    if (!prompt) {
      alert('Please enter a prompt.');
      return;
    }

    setLoading(true);
    setOutput('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_MY_API_BASE}/api/genai`, {
        prompt,
        tone,
        type,
      });
      setOutput(response.data.generated);
    } catch (err) {
      console.error(err);
      setOutput('Failed to generate content. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate('/roadmap', {
      state: { goal, currentSkills }
    });
  };

  const handleInterviewRedirect = () => {
    navigate('/interview');
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-black mb-4">
              AI-Powered Tools
            </h1>
            <p className="text-black max-w-2xl mx-auto">
              Leverage the power of artificial intelligence to enhance your professional profile. Our suite of AI tools helps you create compelling resumes, generate engaging bios, and build your personal brand.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`card text-left transition-all duration-300 bg-white border border-gray-200 p-4 rounded-lg ${
                  activeTool === tool.id ? 'ring-2 ring-blue-600' : 'hover:shadow-lg'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-2xl">{tool.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black">{tool.name}</h3>
                    <p className="text-black mt-1">{tool.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="card bg-white border border-gray-200 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-black">
                {tools.find((t) => t.id === activeTool)?.name}
              </h2>
              <span className="text-4xl">
                {tools.find((t) => t.id === activeTool)?.icon}
              </span>
            </div>

            <div className="space-y-6">
              {activeTool === 'interview' && (
                <div className="text-center">
                  <p className="mb-4 text-black">Practice technical and behavioral questions in a simulated interview environment.</p>
                  <button
                    onClick={handleInterviewRedirect}
                    className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
                  >
                    Go to Mock Interview
                  </button>
                </div>
              )}

              {activeTool === 'bio' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Professional Background
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black h-32"
                      placeholder="Tell us about your experience and expertise..."
                      value={bioPrompt}
                      onChange={(e) => setBioPrompt(e.target.value)}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Tone
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                      value={bioTone}
                      onChange={(e) => setBioTone(e.target.value)}
                    >
                      <option>Professional</option>
                      <option>Casual</option>
                      <option>Creative</option>
                      <option>Technical</option>
                    </select>
                  </div>
                  <button
                    onClick={() => generateContent('Bio', bioPrompt, bioTone, setBioOutput, setBioLoading)}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    {bioLoading ? 'Generating...' : 'Generate Bio'}
                  </button>
                  {bioOutput && (
                    <div className="border-t pt-3">
                      <h3 className="font-medium text-black">Generated Output:</h3>
                      <p className="mt-2 whitespace-pre-wrap text-black">{bioOutput}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTool === 'post' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Post Context
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black h-32"
                      placeholder="Describe the post you want to make..."
                      value={postPrompt}
                      onChange={(e) => setPostPrompt(e.target.value)}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Tone
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                      value={postTone}
                      onChange={(e) => setPostTone(e.target.value)}
                    >
                      <option>Motivational</option>
                      <option>Friendly</option>
                      <option>Inspirational</option>
                      <option>Professional</option>
                    </select>
                  </div>
                  <button
                    onClick={() => generateContent('Post', postPrompt, postTone, setPostOutput, setPostLoading)}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    {postLoading ? 'Generating...' : 'Generate Post'}
                  </button>
                  {postOutput && (
                    <div className="border-t pt-3">
                      <h3 className="font-medium text-black">Generated Output:</h3>
                      <p className="mt-2 whitespace-pre-wrap text-black">{postOutput}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTool === 'path' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Your Goal
                    </label>
                    <input
                      type="text"
                      value={goal}
                      onChange={e => setGoal(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                      placeholder="e.g., Content Writer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Your Current Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      value={currentSkills}
                      onChange={e => setCurrentSkills(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black"
                      placeholder="e.g., English, SEO, Grammar"
                    />
                  </div>
                  <button
                    onClick={handleNavigate}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Generate Customized Learning Path
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
