import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

export async function connectMongoDB() {
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
  }

  try {
    if (mongoose.connections[0].readyState) {
      console.log("Already connected to MongoDB")
      return
    }

    const connectionInstance = await mongoose.connect(MONGODB_URI)
    console.log(`\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)
  } catch (err) {
    console.log("MongoDB connection failed: ", err)
    process.exit(1)
  }
}

export default connectMongoDB
