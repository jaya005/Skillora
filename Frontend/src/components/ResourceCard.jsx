import React, { useEffect, useState } from 'react';

const ResourceCard = ({ title, summary }) => {
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    const fetchYouTubeLink = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_MY_API_BASE}/api/youtube?q=${encodeURIComponent(title)}`);
        const data = await res.json();
        if (data.videoUrl) {
          setVideoUrl(data.videoUrl);
        }
      } catch (err) {
        console.error('Error fetching YouTube link:', err);
      }
    };

    fetchYouTubeLink();
  }, [title]);

  return (
    <div
      style={{
        background: '#fff',
        padding: '16px',
        borderRadius: '10px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        width: 'calc(50% - 16px)',
        minWidth: '240px'
      }}
    >
      <h5 style={{ marginBottom: '10px' }}>
        {videoUrl ? (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0077b6', textDecoration: 'none' }}
          >
            {title}
          </a>
        ) : (
          title
        )}
      </h5>
      <p style={{ color: '#555' }}>{summary}</p>
    </div>
  );
};

export default ResourceCard;

