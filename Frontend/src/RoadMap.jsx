import React, { useEffect, useState } from 'react';
import NodeDetails from './components/NodeDetails'
import axios from 'axios'
import { useLocation } from 'react-router-dom';
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

// Function to create smooth curved path positions
const createSmoothCurvedPath = (steps) => {
  const positions = [];
  const centerX = 50; // Use percentage for responsive design
  const startY = 8; // Reduced start position to give more room
  const amplitude = 20; // Increased amplitude for more pronounced curves
  const stepHeight = 18; // Increased step height significantly for better spacing
  
  for (let i = 0; i < steps; i++) {
    const progress = i / Math.max(1, steps - 1);
    // Use sine wave with adjusted frequency for smoother curves
    const x = centerX + Math.sin(progress * Math.PI * 1.2) * amplitude;
    const y = startY + (i * stepHeight);
    positions.push({ x: `${x}%`, y: `${y}vh` });
  }
  
  return positions;
};

// Function to create smooth SVG path
const createSmoothSVGPath = (positions) => {
  if (positions.length < 2) return '';
  
  let path = `M ${parseFloat(positions[0].x)} ${parseFloat(positions[0].y) * 0.85}`;
  
  for (let i = 1; i < positions.length; i++) {
    const curr = positions[i];
    const prev = positions[i - 1];
    
    if (i === 1) {
      // First curve - start with a quadratic curve
      const controlX = (parseFloat(prev.x) + parseFloat(curr.x)) / 2;
      const controlY = parseFloat(prev.y) * 0.85 + 3;
      path += ` Q ${controlX} ${controlY} ${parseFloat(curr.x)} ${parseFloat(curr.y) * 0.85}`;
    } else {
      // Smooth curves using cubic bezier
      const prevPrev = positions[i - 2];
      const next = positions[i + 1];
      
      // Calculate control points for smooth curves
      const cp1x = parseFloat(prev.x) + (parseFloat(curr.x) - parseFloat(prevPrev.x)) * 0.2;
      const cp1y = parseFloat(prev.y) * 0.85 + 2;
      const cp2x = parseFloat(curr.x) - (next ? (parseFloat(next.x) - parseFloat(prev.x)) * 0.2 : 0);
      const cp2y = parseFloat(curr.y) * 0.85 - 2;
      
      path += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${parseFloat(curr.x)} ${parseFloat(curr.y) * 0.85}`;
    }
  }
  
  return path;
};

const RoadmapContent = () => {
   const location = useLocation();
  const { goal, currentSkills } = location.state || {}; 
  const [roadmapArray, setRoadmapArray] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setIsLoading(true);       
const response = await axios.post(`${process.env.REACT_APP_MY_API_BASE}/api/roadmap`, {
  currentSkills,
  goal
});

console.log('API response:', response.data); // should show { roadmap: [...] }

const roadmapArray = response.data.roadmap; // access the array properly

const roadmap = roadmapArray.map((step, index) => ({
  id: `${index + 1}`,
  title: step.title,  // use step.title directly
  description: step.description, // use step.description directly
  color: colors[index % colors.length],
  order: index + 1,
  completed: false,
}));


        setRoadmapArray(roadmap);
        setPositions(createSmoothCurvedPath(roadmap.length));
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading roadmap:', err);
        setIsLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  const handleNodeClick = (step) => {
    setSelectedNode(step);
  };

  const toggleComplete = (stepId) => {
    setRoadmapArray(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    ));
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '70vh',
        fontSize: '18px',
        color: '#666'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Loading your personalized roadmap...
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Calculate dynamic height based on number of steps
  const containerHeight = Math.max(100, 20 + (roadmapArray.length * 18));

  return (
    <>
      <div style={{ 
        position: 'relative',
        height: `${containerHeight}vh`, // Dynamic height based on number of steps
        width: '100%',
        background: 'linear-gradient(135deg, #e8f5e8 0%, #a8e6cf 50%, #88d8c0 100%)',
        borderRadius: '16px',
        overflow: 'visible', // Changed from hidden to visible to prevent clipping
        boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
        padding: '30px'
      }}>
        {/* Smooth Curved Road Path */}
        <svg 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            pointerEvents: 'none'
          }}
          viewBox={`0 0 100 ${containerHeight * 0.85}`} // Adjusted viewBox for dynamic height
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor: '#2c3e50', stopOpacity: 0.8}} />
              <stop offset="50%" style={{stopColor: '#34495e', stopOpacity: 0.9}} />
              <stop offset="100%" style={{stopColor: '#2c3e50', stopOpacity: 0.8}} />
            </linearGradient>
            <linearGradient id="roadHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor: '#3d4a5c', stopOpacity: 0.6}} />
              <stop offset="50%" style={{stopColor: '#4a5768', stopOpacity: 0.7}} />
              <stop offset="100%" style={{stopColor: '#3d4a5c', stopOpacity: 0.6}} />
            </linearGradient>
            <filter id="roadShadow">
              <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000" floodOpacity="0.25"/>
            </filter>
            <filter id="roadInnerShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.15"/>
            </filter>
          </defs>
          
          {positions.length > 1 && (
            <>
              {/* Road Shadow Layer */}
              <path
                d={createSmoothSVGPath(positions)}
                stroke="#1a252f"
                strokeWidth="16" // Slightly reduced for better proportion
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.3"
                transform="translate(0.5, 1)"
              />
              
              {/* Main Road */}
              <path
                d={createSmoothSVGPath(positions)}
                stroke="url(#roadGradient)"
                strokeWidth="14" // Reduced road width
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#roadShadow)"
              />
              
              {/* Road Highlight */}
              <path
                d={createSmoothSVGPath(positions)}
                stroke="url(#roadHighlight)"
                strokeWidth="10" // Reduced highlight width
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Road Center Lines */}
              <path
                d={createSmoothSVGPath(positions)}
                stroke="white"
                strokeWidth="1.5" // Reduced center line width
                fill="none"
                strokeDasharray="8,4" // Adjusted dash pattern
                opacity="0.9"
                strokeLinecap="round"
              />
            </>
          )}
        </svg>

        {/* Learning Path Nodes */}
        {roadmapArray.map((step, index) => {
          const position = positions[index];
          if (!position) return null;
          
          return (
            <div
              key={step.id}
              onClick={() => handleNodeClick(step)}
              style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.08)';
                e.currentTarget.style.zIndex = '10';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                e.currentTarget.style.zIndex = '2';
              }}
            >
              {/* Node Container */}
              <div style={{
                background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
                borderRadius: '20px',
                padding: '18px 24px', // Increased padding for better spacing
                minWidth: '220px', // Increased minimum width
                minHeight: '90px', // Increased minimum height
                maxWidth: '280px', // Added max width to prevent overly wide nodes
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 32px ${step.color}40, 0 4px 16px rgba(0,0,0,0.15)`,
                border: '3px solid rgba(255,255,255,0.9)',
                position: 'relative',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(10px)'
              }}>
                {/* Step Number Badge */}
                <div style={{
                  position: 'absolute',
                  top: '-18px', // Moved further up
                  left: '24px',
                  background: 'linear-gradient(135deg, #fff, #f8f9fa)',
                  color: step.color,
                  width: '32px', // Slightly larger
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px', // Slightly larger font
                  fontWeight: 'bold',
                  boxShadow: `0 4px 16px ${step.color}30, 0 2px 8px rgba(0,0,0,0.1)`,
                  border: `2px solid ${step.color}30`
                }}>
                  {step.order}
                </div>

                {/* Completion Status */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleComplete(step.id);
                  }}
                  style={{
                    position: 'absolute',
                    top: '-18px', // Moved further up
                    right: '24px',
                    background: step.completed ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #fff, #f8f9fa)',
                    color: step.completed ? 'white' : '#ccc',
                    width: '32px', // Slightly larger
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    cursor: 'pointer',
                    boxShadow: step.completed ? '0 4px 16px #4CAF5030, 0 2px 8px rgba(0,0,0,0.1)' : '0 4px 16px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    border: step.completed ? '2px solid #4CAF5030' : '2px solid #e0e0e0'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  ✓
                </div>

                {/* Node Content */}
                <div style={{
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '16px', // Slightly increased font size
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  lineHeight: '1.4',
                  letterSpacing: '0.3px',
                  wordWrap: 'break-word', // Ensure text wraps properly
                  hyphens: 'auto'
                }}>
                  {step.title}
                </div>

                {/* Progress indicator */}
                <div style={{
                  position: 'absolute',
                  bottom: '-15px', // Moved further down
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '22px', // Slightly larger
                  height: '22px',
                  background: step.completed ? 'linear-gradient(135deg, #4CAF50, #45a049)' : `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
                  borderRadius: '50%',
                  border: '3px solid rgba(255,255,255,0.9)',
                  boxShadow: step.completed ? '0 4px 16px #4CAF5030' : `0 4px 16px ${step.color}30`
                }}></div>
              </div>
            </div>
          );
        })}

        {/* Progress Statistics */}
        <div style={{
          position: 'absolute',
          top: '25px',
          right: '25px',
          background: 'rgba(255,255,255,0.95)',
          padding: '16px 20px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          zIndex: 3,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '6px', fontWeight: '500' }}>
            Progress
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
            {roadmapArray.filter(s => s.completed).length} / {roadmapArray.length}
          </div>
          <div style={{ 
            width: '50px', 
            height: '4px', 
            background: '#e0e0e0', 
            borderRadius: '2px', 
            marginTop: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(roadmapArray.filter(s => s.completed).length / roadmapArray.length) * 100}%`,
              height: '100%', // Changed from 50% to 100%
              background: 'linear-gradient(90deg, #4CAF50, #45a049)',
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>
      </div>
            {selectedNode && (
  <NodeDetails 
    selectedNode={selectedNode}
    toggleComplete={toggleComplete}
    setSelectedNode={setSelectedNode}
  />
)}
      {/* Selected Node Details */}
      {/* {selectedNode && (
        <div style={{ 
          marginTop: '20px',
          padding: '28px', 
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          boxShadow: '0 12px 48px rgba(0,0,0,0.1)',
          border: `3px solid ${selectedNode.color}40`,
          position: 'relative',
          animation: 'slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <style>
            {`
              @keyframes slideIn {
                from {
                  opacity: 0;
                  transform: translateY(30px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}
          </style>
          
          <div style={{
            position: 'absolute',
            top: '-16px',
            left: '28px',
            background: `linear-gradient(135deg, ${selectedNode.color}, ${selectedNode.color}dd)`,
            color: 'white',
            padding: '8px 20px',
            borderRadius: '25px',
            fontSize: '13px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: `0 4px 16px ${selectedNode.color}40`
          }}>
            Step {selectedNode.order}
          </div>
          
          <h3 style={{ 
            color: '#333', 
            marginTop: '12px',
            fontSize: '26px',
            fontWeight: 'bold',
            lineHeight: '1.3'
          }}>
            {selectedNode.title}
          </h3>
          
          <p style={{ 
            color: '#666', 
            lineHeight: '1.7',
            fontSize: '16px',
            marginTop: '16px'
          }}>
            {selectedNode.description}
          </p>
          
          <div style={{
            marginTop: '24px',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={() => toggleComplete(selectedNode.id)}
              style={{
                background: selectedNode.completed ? 'linear-gradient(135deg, #4CAF50, #45a049)' : `linear-gradient(135deg, ${selectedNode.color}, ${selectedNode.color}dd)`,
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '15px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: selectedNode.completed ? '0 6px 20px #4CAF5030' : `0 6px 20px ${selectedNode.color}30`,
                letterSpacing: '0.3px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = selectedNode.completed ? '0 8px 25px #4CAF5040' : `0 8px 25px ${selectedNode.color}40`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = selectedNode.completed ? '0 6px 20px #4CAF5030' : `0 6px 20px ${selectedNode.color}30`;
              }}
            >
              {selectedNode.completed ? '✓ Completed' : 'Mark Complete'}
            </button>
            
            <button 
              onClick={() => setSelectedNode(null)}
              style={{
                background: 'transparent',
                color: '#666',
                border: '2px solid #dee2e6',
                padding: '14px 28px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '15px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                letterSpacing: '0.3px'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#adb5bd';
                e.target.style.color = '#333';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#dee2e6';
                e.target.style.color = '#666';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Close
            </button>
          </div>
        </div>
      )} */}
    </>
  );
};

const Roadmap = ({goal,currentSkills}) => (
  <div style={{ 
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }}>
    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
      <h1 style={{ 
        fontSize: '36px',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '10px'
      }}>
        Your Learning Journey to Success
      </h1>
      <p style={{ 
        color: '#666', 
        fontSize: '18px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        Follow this personalized roadmap to achieve your career goals. Click on any step to explore detailed learning materials and track your progress.
      </p>
    </div>
    
    <RoadmapContent goal={goal} currentSkills={currentSkills}/>
  </div>
);

export default Roadmap;