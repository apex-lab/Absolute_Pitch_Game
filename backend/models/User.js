import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Track each enemy kill with its timestamp
const killSchema = new Schema({
  enemyId: { type: String, required: true },
  killTime: { type: Number, required: true } // Use Date for easier timestamp handling
});

// One record per level completed
const levelSchema = new Schema({
  levelNumber: { type: Number, required: true },
  completionTime: { type: Number, required: true }, // seconds
  score: { type: Number, required: true },
  enemiesKilled: { type: Number, required: true },
  killData: [killSchema],
});

// Full player schema
const userSchema = new Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  currentLevel: { type: Number, default: 1 },
  levelsCompleted: [levelSchema]
});

const Users = mongoose.model("Users", userSchema);
export default Users;
