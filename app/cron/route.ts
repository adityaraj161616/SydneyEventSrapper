import { NextResponse } from "next/server"
import { scrapeEvents } from "@/lib/scraper"

// This route is meant to be called by a cron job service like Vercel Cron
export async function GET() {
  try {
    console.log("Starting scheduled event scraping...")

    const events = await scrapeEvents()

    return NextResponse.json({
      success: true,
      message: `Successfully scraped ${events.length} events`,
    })
  } catch (error) {
    console.error("Scheduled scraping error:", error)
    return NextResponse.json({ error: "Failed to scrape events" }, { status: 500 })
  }
}
