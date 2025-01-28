import express from 'express';
import { authenticateUser } from '../config/auth'; // Import the auth functions

const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authenticateUser(email, password);
    res.json({ token });
  } catch (err) {
    if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(400).json({ message: 'An unknown error occurred' });
      }
  }
});

export default authRouter;
