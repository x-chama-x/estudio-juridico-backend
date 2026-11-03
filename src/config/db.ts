import mongoose from "mongoose";
import logger from "./logger";

export async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('Falta la variable MONGODB_URI en el .env')
  }
  await mongoose.connect(uri)
  logger.info('Conectado a MongoDB')
}

