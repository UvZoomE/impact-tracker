import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRouter from './routes/signin.js';
import dotenv from 'dotenv';
import authMiddleware from './middleware/authMiddleware.js';
import User from './models/User.js';
import War from './models/War.js';
import Player from './models/Player.js';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({ origin: '*' }));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Add these event listeners for more detailed connection information
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB Atlas');
});

app.get('/leaderboard', async (req, res) => {
  try {
    const players = await Player.find().sort({ totalScore: -1 }).limit(10);
    const leaderboard = players.map((player, index) => ({
      rank: index + 1,
      username: player.username,
      warsSubmitted: player.warsSubmitted,
      totalScore: player.totalScore
    }));
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    res.status(500).json({ message: 'Error fetching leaderboard data' });
  }
});

// User route
app.get('/api/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ email: user.email, name: user.name });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

// Wars routes
app.get('/wars', authMiddleware, async (req, res) => {
  try {
    if (req.query.need === 'warCount') {
      const warCount = await War.countDocuments({ userId: req.userId });
      return res.json({ warCount });
    }
    // Add other war-related queries here if needed
  } catch (error) {
    console.error('Error fetching war data:', error);
    res.status(500).json({ message: 'Error fetching war data' });
  }
});

app.post('/wars', authMiddleware, async (req, res) => {
  try {
    const { classification, title, description, impact } = req.body;
    const newWar = new War({
      userId: req.userId,
      classification,
      title,
      description,
      impact,
    });
    await newWar.save();
    res.status(201).json({ message: 'WAR created successfully' });
  } catch (error) {
    console.error('Error creating WAR:', error);
    res.status(500).json({ message: 'Error creating WAR' });
  }
});

app.post('/player/submit-war', authMiddleware, async (req, res) => {
  try {
    const player = await Player.findOneAndUpdate(
      { email: req.user.email },
      { $inc: { warsSubmitted: 1 } },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: 'WAR submitted successfully', player });
  } catch (error) {
    console.error('Error updating player data:', error);
    res.status(500).json({ message: 'Error updating player data' });
  }
});

// New route to fetch all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username email');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Routes
app.use('/auth', authRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
