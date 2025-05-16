import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { generateEventSummary } from "@/lib/groq"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const eventId = url.searchParams.get("id")

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    // Get event from database
    const { db } = await connectToDatabase()
    const event = await db.collection("events").findOne({ _id: eventId })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Generate summary using Groq
    const summary = await generateEventSummary(event)

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("Error generating event summary:", error)
    return NextResponse.json({ error: "Failed to generate event summary" }, { status: 500 })
  }
}
