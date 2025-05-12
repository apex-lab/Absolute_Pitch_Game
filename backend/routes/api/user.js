import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import keys from "../../config/keys.js";
import validateRegisterInput from "../../validation/register.js";
import validateLoginInput from "../../validation/login.js";
import User from "../../models/User.js"

const router = express.Router();
// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  User.findOne({ name: req.body.name }).then(user => {
      if (user) {
        return res.status(400).json({ name: "Username already exists" });
      } else {
        const newUser = new User({
          name: req.body.name,
          password: req.body.password
        });
  // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
  });

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  const name = req.body.name;
    const password = req.body.password;
  // Find user by name
    User.findOne({ name }).then(user => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ usernotfound: "User not found" });
      }
  // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: user.id,
            name: user.name
          };
  // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {expiresIn: '15m'}, 
            (err, token) => {
            const refreshToken = jwt.sign(payload, keys.refreshSecret, { expiresIn: '100d' }); // Refresh token expires in 7 days

              res.json({
                success: true,
                token: "Bearer " + token,
                currentLevel: user.currentLevel 
              });
            }
          );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
  });

router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, keys.refreshSecret);

      // Issue a new access token
      const payload = { id: decoded.id, name: decoded.name };
      const newAccessToken = jwt.sign(payload, keys.secretOrKey, { expiresIn: '15m' });

      res.json({ accessToken: "Bearer " + newAccessToken });
  } catch (err) {
      console.error(err);
      res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});
export default router