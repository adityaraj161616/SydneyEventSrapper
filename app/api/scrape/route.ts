import { NextResponse } from "next/server"
import { scrapeEvents } from "@/lib/scraper"

export async function GET() {
  try {
    console.log("Starting manual event scraping...")

    // This endpoint is for manually triggering the scraper
    const events = await scrapeEvents()

    console.log(`Scraping complete. Found ${events.length} events.`)

    return NextResponse.json({
      success: true,
      message: `Successfully scraped ${events.length} events`,
    })
  } catch (error) {
    console.error("Scraping error:", error)
    return NextResponse.json(
      {
        error: `Failed to scrape events: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
