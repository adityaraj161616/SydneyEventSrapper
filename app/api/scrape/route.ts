import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    console.log("Starting manual event scraping...");

    // This endpoint is for manually triggering the scraper
    const url = "https://www.eventbrite.com/d/australia--sydney/events/";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const events: { title: string; date: string; link: string }[] = [];

    $(".search-event-card-wrapper").each((_, el) => {
      const title = $(el).find(".event-card__formatted-name--is-clamped").text().trim();
      const date = $(el).find(".event-card__formatted-date").text().trim();
      const link = $(el).find("a.eds-event-card-content__action-link").attr("href");
      if (title && date && link) {
        events.push({ title, date, link });
      }
    });

    console.log(`Scraping complete. Found ${events.length} events.`);

    return NextResponse.json({
      success: true,
      message: `Successfully scraped ${events.length} events`,
      events, // <-- Return the events array
    });
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      {
        error: `Failed to scrape events: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    );
  }
}
