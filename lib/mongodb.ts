import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB || "sydney_events"

// Check if MongoDB URI is defined
if (!MONGODB_URI) {
  console.warn("MONGODB_URI is not defined in environment variables")
}

let cachedClient: MongoClient | null = null
let cachedDb: any = null

export async function connectToDatabase() {
  // If we have a cached connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  try {
    // Create a new MongoDB client
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined")
    }

    console.log("Connecting to MongoDB...")
    const client = new MongoClient(MONGODB_URI as string)

    await client.connect()
    const db = client.db(MONGODB_DB)
    console.log("Connected to MongoDB successfully")

    // Cache the client and db connections
    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    throw error
  }
}

const client = new MongoClient(process.env.MONGODB_URI || "")

export async function storeEvents(events: any[]) {
  const db = client.db(process.env.MONGODB_DB || "sydney_events")
  const collection = db.collection("events")

  for (const event of events) {
    await collection.updateOne(
      { _id: event._id },
      { $set: event },
      { upsert: true } // Insert if not already present
    )
  }
}
