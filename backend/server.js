const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const teamFinderRoutes = require('./routes/teamFinder');
const genaiRoutes = require('./routes/genai');
const roadmap = require('./roadmap');
const profileRoutes = require('./routes/Profile');
const geminiResourceRoutes = require('./routes/genaiResources'); // ✅ NEW
const wrapUpRoutes = require('./routes/wrapUpRoutes');
const interviewRoutes = require('./routes/Interview');
const userRoutes = require('./routes/users');
const youtubeSearchRoutes = require('./routes/youtubeSearch'); // ✅ ADD THIS

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: '*', // or your frontend URL
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/youtube', youtubeSearchRoutes); // ✅ ADD THIS
app.use('/api/teamfinder', teamFinderRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/genai', genaiRoutes);
app.use('/api/roadmap', roadmap);
app.use('/api/gemini-resources', geminiResourceRoutes); // ✅ NEW
app.use('/api/interview',interviewRoutes);
app.use('/api/wrapup', wrapUpRoutes);
app.use('/api/gemini-resources', geminiResourceRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/users', userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
