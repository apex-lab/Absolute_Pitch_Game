import dotenv from 'dotenv';

dotenv.config(); 

const keys = {
  mongoURI: process.env.ABSOLUTE_PITCH_DB_URI,
  secretOrKey: "secret"
};

export default keys;