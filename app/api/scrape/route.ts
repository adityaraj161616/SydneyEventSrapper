import { scrapeEvents } from "@/lib/scraper";

export async function GET(req: Request) {
  try {
    const events = await scrapeEvents(); // This function should perform real-time scraping
    return new Response(JSON.stringify({ success: true, events }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error scraping events:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
