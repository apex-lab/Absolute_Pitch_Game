import express from "express";
import User from "../../models/User.js";
import passport from "passport";

const router = express.Router();

// @route POST /api/progress/save
// @desc Save level progress for a user
// @access Private
router.post("/save", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const userId = req.user.id;
    const { levelNumber, completionTime, score, enemiesKilled, killData } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const alreadyExists = user.levelsCompleted.some(
        level => level.levelNumber === levelNumber
      );
  
      if (!alreadyExists) {
        user.levelsCompleted.push({
          levelNumber,
          completionTime,
          score,
          enemiesKilled,
          killData,
          completedAt: new Date()
        });
      }
  
      if (levelNumber >= user.currentLevel) {
        user.currentLevel = levelNumber + 1;
      }
  
      await user.save();
      res.status(200).json({ message: "Progress saved successfully" });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

export default router;
