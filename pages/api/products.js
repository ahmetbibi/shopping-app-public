// import products from '../../static/products.json';
import Product from '../../models/Product';
import connectDb from '../../utils/connectDb';

export default async (req, res) => {
  await connectDb();

  const { page, size } = req.query;
  // Convert query string to number
  const pageNum = Number(page);
  const pageSize = Number(size);

  // To get the total number of documents
  const totalDocs = await Product.countDocuments();

  // To calculate the total pages, to get the last items, we will round up it with Math.ceil()
  const totalPages = Math.ceil(totalDocs / pageSize);

  let products = [];
  if (pageNum === 1) {
    // To get first 9 product, we use limit() function
    products = await Product.find().limit(pageSize);
  } else {
    // We get the first number of products which will be skipped
    const skips = pageSize * (pageNum - 1);
    // Then again we are limiting rest of them
    products = await Product.find().skip(skips).limit(pageSize);
  }
  // const products = await Product.find();

  res.status(200).json({ products, totalPages }); // To send a string, use send() method
};
