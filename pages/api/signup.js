import connectDb from '../../utils/connectDb';
import User from '../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';
import Cart from '../../models/Cart';

export default async (req, res) => {
  await connectDb();

  const { name, email, password } = req.body;
  try {
    // 0- Validate name / email / password
    if (!isLength(name, { min: 3, max: 10 })) {
      return res.status(422).send('Name must be 3 - 10 characters long');
    } else if (!isLength(password, { min: 6 })) {
      return res.status(422).send('Password must be at least 6 characters long');
    } else if (!isEmail(email)) {
      return res.status(422).send('Please provide a valid email');
    }

    // 1- Check if the user already exists in the db
    const user = await User.findOne({ email });
    if (user) {
      return res.status(422).send(`User already exists with email ${email}`);
    }

    // 2- If not hash their password
    const hash = await bcrypt.hash(password, 10);

    // 3- Create user
    const newUser = await new User({
      name,
      email,
      password: hash,
    }).save();
    // console.log({ newUser });

    // 4- Create cart for the new user
    await new Cart({
      user: newUser._id,
    }).save();

    // 5- Create token for the new user
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // 6- Send back the token
    res.status(201).json(token);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error signing up user. Please try again later');
  }
};
