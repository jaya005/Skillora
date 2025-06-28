import { Users, MessageCircle, MoreHorizontal, Plus, Send } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import TeamSuggestions from '../components/TeamSuggestions';
export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const myProfileId = "684ebd98f127a058e7dba9ac";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/profile/${myProfileId}`);
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Main Profile Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-blue-400 via-blue-300 to-gray-300 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-300"></div>
          </div>

          {/* Profile Content */}
          <div className="px-6 pb-6 relative">
            {/* Profile Picture */}
            <div className="relative -mt-16 mb-4">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-semibold">
                  {profile.name?.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>

            {/* Name and Title */}
            
            <div className="mb-4">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                {profile.name}
                <span className="text-sm font-normal text-gray-500 ml-2">• 2nd</span>
              </h1>
              <p className="text-lg text-gray-700 mb-2">{profile.title}</p>
              <p className="text-gray-600 mb-3">
                {profile.location} • <button className="text-blue-600 hover:underline">Contact info</button>
              </p>
              <p className="text-blue-600 font-medium">
                {profile.connections} connections
              </p>
            </div>

            {/* Mutual Connections */}
            {profile.mutualConnections?.length > 0 && (
              <div className="mb-6 flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {profile.mutualConnections.map((connection, index) => (
                    <div key={index} className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xs font-medium">
                        {connection.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                  ))}
                </div>
                {profile.mutualConnections.length >= 2 && (
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">{profile.mutualConnections[0]}</span>, 
                    <span className="font-medium"> {profile.mutualConnections[1]}</span>, 
                    and <span className="font-medium">{profile.mutualCount} other mutual connections</span>
                  </span>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus size={16} />
                Connect
              </button>
              <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-50 transition-colors flex items-center gap-2">
                <Send size={16} />
                Message
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-50 transition-colors">
                <MoreHorizontal size={16} />
                More
              </button>
            </div>
          </div>
        </div>

        {/* Organizations Sidebar */}
        {profile.organizations?.length > 0 && (
          <div className="mt-4 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                {profile.organizations.map((org, index) => (
                  <div key={index} className="flex items-center mb-3 last:mb-0">
                    <div className="w-10 h-10 rounded bg-gray-100 mr-3 flex items-center justify-center">
                      <div className="w-6 h-6 bg-blue-600 rounded"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{org}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Highlights Section */}
        <div className="mt-4 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Highlights</h2>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">Get introduced to {profile.name}</h3>
                <p className="text-gray-600 text-sm mb-3">Ask your mutual connections to help you start a conversation.</p>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <MessageCircle size={14} />
                  Message top connections
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
