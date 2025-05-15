import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Get all subscriptions, sorted by timestamp (newest first)
    const subscriptions = await db.collection("subscriptions").find({}).sort({ timestamp: -1 }).toArray()

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
  }
}
