import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Get all subscribers, sorted by timestamp (newest first)
    const subscribers = await db.collection("subscribers").find({}).sort({ subscribedAt: -1 }).toArray()

    return NextResponse.json(subscribers)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { email, subscribe = true } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    if (subscribe) {
      // Add to subscribers
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

      return NextResponse.json({ success: true, message: "Successfully subscribed" })
    } else {
      // Remove from subscribers
      await db.collection("subscribers").deleteOne({ email })

      return NextResponse.json({ success: true, message: "Successfully unsubscribed" })
    }
  } catch (error) {
    console.error("Error managing subscription:", error)
    return NextResponse.json({ error: "Failed to manage subscription" }, { status: 500 })
  }
}
