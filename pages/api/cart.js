import connectDb from '../../utils/connectDb';
import jwt from 'jsonwebtoken';
import Cart from '../../models/Cart';
import '../../models/Product';
import mongoose from 'mongoose';

// Import this one to make a comparison between object id comes from database and comes from request
const { ObjectId } = mongoose.Types;

export default async (req, res) => {
  await connectDb();

  switch (req.method) {
    case 'GET':
      await handleGetRequest(req, res);
      break;
    case 'PUT':
      await handlePutRequest(req, res);
      break;
    case 'DELETE':
      await handleDeleteRequest(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};

async function handleGetRequest(req, res) {
  // Check the token
  if (!('authorization' in req.headers)) {
    return res.status(401).send('No authorization token');
  }

  try {
    // Verify the token and get the userId
    const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

    // Find user's cart and populate it to show added products
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'products.product', // What we want to populate
      model: 'Product', // Ref value of that path
    });

    // Return the products related to this cart
    res.status(200).json(cart.products);
  } catch (error) {
    console.error(error);
    // res.status(403).send('Please login again');
    res.status(403).send(JSON.stringify(error));
  }
}

async function handlePutRequest(req, res) {
  const { quantity, productId } = req.body;

  // Check the token
  if (!('authorization' in req.headers)) {
    return res.status(401).send('No authorization token');
  }

  try {
    // Verify the token and get the userId
    const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

    // Get user cart based on user id
    const cart = await Cart.findOne({ user: userId });

    // Check the product if it is already exists in the cart
    const productExists = cart.products.some((document) =>
      ObjectId(productId).equals(document.product)
    );

    // If so, increment quantity
    if (productExists) {
      await Cart.findOneAndUpdate(
        { _id: cart._id, 'products.product': productId },
        { $inc: { 'products.$.quantity': quantity } }
      );
    } else {
      // If not, add new product with given quantity
      const newProduct = { quantity, product: productId };
      await Cart.findOneAndUpdate({ _id: cart._id }, { $addToSet: { products: newProduct } });
    }
    res.status(200).send('Cart updated');
  } catch (error) {
    console.error(error);
    res.status(403).send('Please login again');
  }
}

async function handleDeleteRequest(req, res) {
  // Check the token
  const { productId } = req.query;
  if (!('authorization' in req.headers)) {
    return res.status(401).send('No authorization token');
  }

  try {
    // Verify the token and get the userId
    const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { products: { product: productId } } },
      { new: true }
    ).populate({
      path: 'products.product',
      model: 'Product',
    });

    // Return the products related to this cart
    res.status(200).json(cart.products);
  } catch (error) {
    console.error(error);
    res.status(403).send('Please login again');
  }
}
