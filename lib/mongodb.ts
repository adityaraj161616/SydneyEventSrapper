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

    // Extract database name from URI or use default
    let dbName = MONGODB_DB
    if (MONGODB_URI.includes("jobboard.fmzx0tb.mongodb.net")) {
      // If using the provided URI, we'll use the Jobboard database
      dbName = "sydney_events"
    }

    const db = client.db(dbName)
    console.log(`Connected to MongoDB successfully (Database: ${dbName})`)

    // Cache the client and db connections
    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    throw error
  }
}
