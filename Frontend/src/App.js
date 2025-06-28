import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AIContentGenerator from './AIContentGenerator';
import RoadmapPage from './RoadMap';
import HomePage from './converted-ui/pages/HomePage';
import Profile from './converted-ui/pages/ProfilePage';
import './App.css';
import AuthPage from './converted-ui/pages/AuthPage';
import Navbar from './converted-ui/components/Navigation';
import LearningPath from './pages/LearningPath';
import InterviewHomePage from './pages/InterviewHomePage';
import InterviewPage from './pages/InterviewPage';
import FeedbackPage from './pages/FeedbackPage';
import ImageDisplay from './components/ImageDisplay';
import ResultPage from './pages/ResultPage';
import InterviewMain from './pages/InterviewMain';
import SchedulePage from './pages/SchedulePage';
import TeamSuggestions from './components/TeamSuggestions';
import WrapPage from './converted-ui/pages/WrapPage';
import ConnectPage from './converted-ui/pages/ConnectPage';
import LearnPage from './converted-ui/pages/LearnPage';
import ResourcesPage from './converted-ui/pages/ResourcesPage';
import JobsPage from './converted-ui/pages/JobsPage';
import AiToolsPage from './converted-ui/pages/AiToolsPage';
import CommunitiesPage from './converted-ui/pages/CommunitiesPage';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [goal, setGoal] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const myProfileId = '684ebd98f127a058e7dba9ac';

  const handleClick = () => {
    const skillsArray = currentSkills.split(',').map((skill) => skill.trim());
    localStorage.setItem('goal', goal);
    localStorage.setItem('currentSkills', JSON.stringify(skillsArray));
    navigate('/roadmap');
  };

  // 👇 Check current route
  const isAiToolsPage = location.pathname === '/ai-tools';

  return (
    <>
      <Navbar />
      {/* Set black text only for /ai-tools, white text for all others */}
      <div
        className={`min-h-screen ${
          isAiToolsPage ? 'bg-light text-dark' : 'bg-dark text-light'
        }`}
      >
        <Routes>
          <Route path="/learning-path" element={<LearningPath />} />
          <Route path="/wrap" element={<WrapPage />} />
          <Route path="/connect" element={<ConnectPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/ai-tools" element={<AiToolsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/roadmap" element={<RoadmapPage goal={goal} currentSkills={currentSkills} />} />
          <Route path="/interview/:id" element={<InterviewPage />} />
          <Route path="/feedback/:id" element={<FeedbackPage />} />
          <Route path="/interviewai" element={<InterviewHomePage />} />
          <Route path="/interview" element={<InterviewMain />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/findteam" element={<TeamSuggestions profileId={myProfileId} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
