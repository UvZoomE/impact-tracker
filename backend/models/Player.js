import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  warsSubmitted: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 }
});

const Player = mongoose.model('Player', PlayerSchema);

export default Player;
