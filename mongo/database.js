import mongoose from 'mongoose';

async function connect() {
  await mongoose.connect(
    'mongodb://localhost:27017/compression'
  );
  console.log("Database: Connected");
}

export { connect };
