import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB || "eventdb";

export async function POST(req: Request) {
  try {
    const { events } = await req.json();
    if (!Array.isArray(events)) {
      return NextResponse.json({ error: "Invalid events data" }, { status: 400 });
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("events");

    // Optional: Remove duplicates based on title+date+link
    for (const event of events) {
      await collection.updateOne(
        { title: event.title, date: event.date, link: event.link },
        { $set: event },
        { upsert: true }
      );
    }

    await client.close();
    return NextResponse.json({ success: true, count: events.length });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save events" }, { status: 500 });
  }
}