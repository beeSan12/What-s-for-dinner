import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
await mongoose.connect(process.env.DB_CONNECTION_STRING)
await mongoose.connection.db.collection('embeddings').drop().catch(() => {})
console.log('Dropped embeddings')
await mongoose.disconnect()
