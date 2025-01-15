import mongoose from "mongoose";
const Schema = mongoose.Schema;

const enemyAppearanceSchema = new Schema({
  enemyId: Number,
  position: {
    type: String,
    enum: ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'mid-left', 'mid-right'],
    required: true
  },
  appearanceTime: Date,    // Timestamp when the enemy appears
  reactionTime: {
    type: Number,       // Time in milliseconds from the appearance to player's reaction
    required: true
  }
});

const LevelScema = new Schema({ 
  levelID: Number, 
  points: Number, 
  completionTime: Number, 
  Iterations: Number, 
  enemyAppearances: [enemyAppearanceSchema]
 })

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  levelsCompleted: [LevelScema]
});

const Users = mongoose.model("Users", UserSchema);

export default Users;
