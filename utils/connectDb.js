import mongoose from 'mongoose';

const connection = {};

async function connectDb() {
  // Check if there is a isConnected property of connection object
  if (connection.isConnected) {
    // If yes, use existing database connection
    console.log('Using existing database connection');
    return;
  }
  // This returns a promise
  const db = await mongoose.connect(process.env.MONGO_SRV, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Database connected');

  // To connect from a serverless backend like AWS etc.
  connection.isConnected = db.connections[0].readyState;
}

export default connectDb;
