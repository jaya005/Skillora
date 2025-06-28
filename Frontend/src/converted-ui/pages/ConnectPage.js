'use client';

import { useState } from 'react';
import {
  X,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  Sparkles,
  Search,
  Users,
  ArrowRight,
} from 'lucide-react';

import axios from 'axios';
// Chat Modal Component
function ChatModal({ person, onClose }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hi! I saw your profile and would love to connect. Your work at ${person.org} looks really interesting!`,
      sender: 'me',
      time: '2:30 PM',
    },
    {
      id: 2,
      text: "Hello! Thanks for reaching out. I'd be happy to chat about our projects.",
      sender: 'them',
      time: '2:32 PM',
    },
  ]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiHelper, setShowAiHelper] = useState(false);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: message,
          sender: 'me',
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
      setMessage('');
    }
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
      setMessage(response.data.generated);
      setAiPrompt('');
      setShowAiHelper(false);
    } catch (err) {
      console.error(err);
      alert('AI generation failed.');
    } finally {
      setAiLoading(false);
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white text-[#202A44] dark:bg-black dark:text-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img
              src={person.image}
              alt={person.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold">{person.name}</h3>
              <p className="text-sm text-green-500">● Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <Video className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <MoreVertical className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === 'me' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                  msg.sender === 'me'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-[#202A44] dark:text-white rounded-bl-md'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.sender === 'me'
                      ? 'text-blue-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* AI Helper */}
        {showAiHelper && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                AI Writing Assistant
              </h3>
              <button
                onClick={() => setShowAiHelper(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe what you want to say..."
              className="w-full h-20 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-[#202A44] dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={generateWithAI}
              disabled={aiLoading || !aiPrompt.trim()}
              className="w-full mt-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
            >
              {aiLoading ? 'Generating...' : 'Generate Message'}
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowAiHelper(!showAiHelper)}
              className={`p-2 rounded-full ${
                showAiHelper
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
              title="AI Writing Assistant"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 text-[#202A44] dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                <Smile className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-full transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ConnectPage Component
export default function ConnectPage() {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const people = [
    {
      name: 'Aisha Kapoor',
      role: 'Frontend Developer',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      mutuals: 5,
      org: 'Zypher',
      status: 'online',
    },
    {
      name: 'Ronit Ganguli',
      role: 'Graphic Designer',
      image: 'https://randomuser.me/api/portraits/men/55.jpg',
      mutuals: 3,
      org: 'DeepLearn Labs',
      status: 'away',
    },
    {
      name: 'Jassi Kapoor',
      role: 'Music Producer',
      image: 'https://randomuser.me/api/portraits/men/77.jpg',
      mutuals: 11,
      org: 'White Hill Music',
      status: 'away',
    },
    {
      name: 'Sara Ali',
      role: 'Product Designer',
      image: 'https://randomuser.me/api/portraits/women/72.jpg',
      mutuals: 8,
      org: 'CreativeFox',
      status: 'online',
    },
    {
      name: 'Mishika Singh',
      role: 'Content Writer',
      image: 'https://randomuser.me/api/portraits/women/69.jpg',
      mutuals: 5,
      org: 'TelX',
      status: 'online',
    },
    {
      name: 'Raj Mehta',
      role: 'AI/ML Intern',
      image: 'https://randomuser.me/api/portraits/men/75.jpg',
      mutuals: 4,
      org: 'DeepLearn Labs',
      status: 'away',
    },
    {
      name: 'Reet Sharma',
      role: 'Painter',
      image: 'https://randomuser.me/api/portraits/women/82.jpg',
      mutuals: 9,
      org: 'Create-Zone Ltd',
      status: 'online',
    },
    {
      name: 'Madhu Gupta',
      role: 'Chef',
      image: 'https://randomuser.me/api/portraits/women/62.jpg',
      mutuals: 8,
      org: 'Raddison',
      status: 'online',
    },
  ];

  const filteredPeople = people.filter((person) => {
    const query = searchTerm.toLowerCase();
    return (
      person.name.toLowerCase().includes(query) ||
      person.role.toLowerCase().includes(query) ||
      person.org.toLowerCase().includes(query) ||
      person.mutuals.toString().includes(query)
    );
  });

  const handleTeamFinderClick = () => {
    // In a real app, you'd use Next.js router or your routing solution
    window.location.href = '/findteam';
  };

  return (
    <div className="min-h-screen bg-white text-[#202A44] dark:bg-black dark:text-white py-10 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#202A44] dark:text-white mb-4">
            Connect with Professionals
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Discover and connect with talented professionals in your field. Build meaningful relationships that advance your career.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, role, or company..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#202A44] dark:text-white"
            />
          </div>
        </div>

        {/* Team Finder Card */}
        <div className="mb-10">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Find Your Perfect Team</h3>
                  <p className="text-purple-100 text-sm">
                    Discover like-minded professionals and build your dream team for upcoming projects and collaborations.
                  </p>
                </div>
              </div>
              <button
                onClick={handleTeamFinderClick}
                className="bg-white text-purple-600 font-semibold py-2 px-4 rounded-xl hover:bg-gray-100 transition-all duration-200 flex items-center space-x-2 whitespace-nowrap"
              >
                <span>Find Teammates</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPeople.length > 0 ? (
            filteredPeople.map((person, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-100 dark:ring-gray-700"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-900 ${
                        person.status === 'online'
                          ? 'bg-green-500'
                          : 'bg-yellow-500'
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{person.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      {person.role}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-6">
                  <p>🤝 {person.mutuals} mutual connections</p>
                  <p>🏢 Works at {person.org}</p>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 shadow-sm">
                    Connect
                  </button>
                  <button
                    onClick={() => setSelectedPerson(person)}
                    className="flex-1 bg-white dark:bg-gray-800 text-[#202A44] dark:text-white font-semibold py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200"
                  >
                    Message
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
              No matches found.
            </p>
          )}
        </div>
      </div>

      {selectedPerson && (
        <ChatModal person={selectedPerson} onClose={() => setSelectedPerson(null)} />
      )}
    </div>
  );
}