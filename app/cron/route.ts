import { NextResponse } from "next/server"
import { scrapeEvents } from "@/lib/scraper"

// This route is meant to be called by a cron job service like Vercel Cron
export async function GET(request: Request) {
  try {
    // Check for authorization token if needed
    const url = new URL(request.url)
    const token = url.searchParams.get("token")

    // Optional: Validate token for security
    const validToken = process.env.CRON_SECRET_TOKEN
    if (validToken && token !== validToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Starting scheduled event scraping...")

    const events = await scrapeEvents()

    return NextResponse.json({
      success: true,
      message: `Successfully scraped ${events.length} events`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Scheduled scraping error:", error)
    return NextResponse.json(
      {
        error: "Failed to scrape events",
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
