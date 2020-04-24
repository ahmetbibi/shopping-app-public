import connectDb from '../../utils/connectDb';
import User from '../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async (req, res) => {
  await connectDb();

  const { email, password } = req.body;
  try {
    // 1- Check if the user exists with the provided email
    const user = await User.findOne({ email }).select('+password');
    // 2- If not, return an error
    if (!user) {
      return res.status(404).send('No user exists with that email');
    }
    // 3- Check users password matches the one in db

    const passwordMatch = await bcrypt.compare(password, user.password); // One way encyription

    // 4- If so, create a token
    if (passwordMatch) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      // 5- Send that token to the client
      res.status(200).json(token);
    } else {
      res.status(401).send('Wrong password');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error logging in user');
  }
};
