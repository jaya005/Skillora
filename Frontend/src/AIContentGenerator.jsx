import React, { useState } from 'react';
import axios from 'axios';

const Section = ({ label, type }) => {
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Formal');
  const [generated, setGenerated] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!prompt) {
      alert('Please enter a prompt.');
      return;
    }

    setLoading(true);
    setGenerated('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_MY_API_BASE}/api/genai`, {
        prompt,
        tone,
        type,
      });
      setGenerated(response.data.generated);
    } catch (err) {
      console.error(err);
      setGenerated('Failed to generate content. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">{label}</h2>
      <textarea
        className="w-full p-3 border rounded-md"
        placeholder={`Enter details for ${label.toLowerCase()}...`}
        value={prompt}
        rows={4}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <select
        className="w-full p-2 border rounded-md"
        value={tone}
        onChange={(e) => setTone(e.target.value)}
      >
        <option value="Formal">Formal</option>
        <option value="Friendly">Friendly</option>
        <option value="Motivational">Motivational</option>
      </select>
      <button
        onClick={generate}
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
      >
        {loading ? 'Generating...' : `Generate ${type}`}
      </button>
      {generated && (
        <div className="border-t pt-3">
          <h3 className="font-medium text-gray-700">Generated Output:</h3>
          <p className="mt-2 whitespace-pre-wrap text-gray-800">{generated}</p>
        </div>
      )}
    </div>
  );
};

const AIContentGenerator = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <Section label="🧬 Profile Bio Generator" type="Bio" />
      <Section label="💬 Networking Message Generator" type="Message" />
      <Section label="📢 Collaboration Post Generator" type="Post" />
    </div>
  );
};

export default AIContentGenerator;
