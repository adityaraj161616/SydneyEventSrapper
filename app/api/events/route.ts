import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    console.log("API: Fetching events from database")
    const { db } = await connectToDatabase()

    // Get all events, sorted by date (newest first)
    const events = await db
      .collection("events")
      .find({})
      .sort({ date: 1 }) // Upcoming events first
      .toArray()

    console.log(`API: Found ${events.length} events`)

    // If no events are found, return an empty array but with a 200 status
    return NextResponse.json(events)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
