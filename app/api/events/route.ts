import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { filterEventsByDate } from "@/lib/filterEvents";

async function fetchEventsFromDatabase() {
  try {
    console.log("API: Fetching events from database");
    const { db } = await connectToDatabase();

    // Get all events, sorted by date (newest first)
    const events = await db
      .collection("events")
      .find({})
      .sort({ date: 1 }) // Upcoming events first
      .toArray();

    console.log(`API: Found ${events.length} events`);
    return events;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch events");
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const filter = url.searchParams.get("filter") || "all";

  // Fetch events from the database
  const events = await fetchEventsFromDatabase();

  // Filter events based on the query parameter
  const filteredEvents = filterEventsByDate(events, filter);

  return new Response(JSON.stringify(filteredEvents), {
    headers: { "Content-Type": "application/json" },
  });
}
