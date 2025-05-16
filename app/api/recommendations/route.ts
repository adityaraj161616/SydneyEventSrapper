import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { generateEventRecommendations } from "@/lib/groq"

export async function POST(request: Request) {
  try {
    const { preferences } = await request.json()

    if (!preferences) {
      return NextResponse.json({ error: "User preferences are required" }, { status: 400 })
    }

    console.log("Received recommendation request with preferences:", preferences)

    // Get events from database
    const { db } = await connectToDatabase()
    const events = await db.collection("events").find({}).toArray()

    if (events.length === 0) {
      console.log("No events found in database")
      return NextResponse.json({ recommendations: [] })
    }

    console.log(`Found ${events.length} events in database`)

    // Add date range debugging
    if (preferences.dateInfo && preferences.dateInfo.type) {
      const today = new Date()
      const dateType = preferences.dateInfo.type

      // Log date range information
      console.log(`Date range requested: ${dateType}`)
      console.log(`Today's date: ${today.toISOString()}`)

      // Calculate and log relevant date boundaries
      if (dateType === "week") {
        const endOfWeek = new Date(today)
        const dayOfWeek = endOfWeek.getDay()
        const daysUntilEndOfWeek = dayOfWeek === 0 ? 7 : 7 - dayOfWeek
        endOfWeek.setDate(endOfWeek.getDate() + daysUntilEndOfWeek)

        console.log(`Week range: ${today.toISOString()} to ${endOfWeek.toISOString()}`)

        // Log events that fall within this week
        const thisWeekEvents = events.filter((event) => {
          const eventDate = new Date(event.date)
          return eventDate >= today && eventDate <= endOfWeek
        })

        console.log(`Events in this week: ${thisWeekEvents.length}`)
        if (thisWeekEvents.length > 0) {
          console.log(
            "Sample events this week:",
            thisWeekEvents.slice(0, 3).map((e) => ({
              title: e.title,
              date: e.date,
              formattedDate: new Date(e.date).toLocaleDateString(),
            })),
          )
        }
      }
    }

    // Generate recommendations using Groq
    const recommendations = await generateEventRecommendations(preferences, events)

    console.log(`Generated ${recommendations.recommendations?.length || 0} recommendations`)

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return NextResponse.json(
      {
        error: `Failed to generate recommendations: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
