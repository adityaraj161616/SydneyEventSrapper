import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { email, eventId, eventTitle, isSubscribed } = await request.json()

    // Validate input
    if (!email || !eventId) {
      return NextResponse.json({ error: "Email and event ID are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Store email subscription
    await db.collection("subscriptions").insertOne({
      email,
      eventId,
      eventTitle,
      isSubscribed,
      timestamp: new Date(),
    })

    // If user opted in, also add to subscribers list
    if (isSubscribed) {
      // Use upsert to avoid duplicates
      await db.collection("subscribers").updateOne(
        { email },
        {
          $set: {
            email,
            lastUpdated: new Date(),
          },
          $setOnInsert: {
            subscribedAt: new Date(),
          },
        },
        { upsert: true },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error storing email:", error)
    return NextResponse.json({ error: "Failed to store email" }, { status: 500 })
  }
}
