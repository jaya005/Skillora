import React, { useState } from 'react';

function TeamSuggestions() {
  const [goal, setGoal] = useState('');
  const [results, setResults] = useState([]);

  const findTeam = async () => {
    const res = await fetch(`${process.env.REACT_APP_MY_API_BASE}/api/teamfinder/complement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profileId: '684ebd98f127a058e7dba9ac', // Example profile ID
        goal: goal,
        topK: 5
      })
    });
    const data = await res.json();
    setResults(data);
  };

  return (
    <div className="container mt-5 mx-30">
      <h2>Find Your Team Because Lone Wolf Doesn’t Scale</h2>
      <input
        className="form-control my-3"
        value={goal}
        onChange={e => setGoal(e.target.value)}
        placeholder="Enter your goal (e.g., Gen AI Hackathon)"
      />
      <button className="btn btn-primary" onClick={findTeam}>Find Team</button>

      <div className="mt-4">
        {results.map((res, index) => (
          <div key={index} className="card mb-3">
            <div className="card-body">
              <h5>{res.profile.name} — {res.profile.title}</h5>
              <p>{res.profile.location}</p>
              <p>Similarity Score: {res.similarity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamSuggestions;