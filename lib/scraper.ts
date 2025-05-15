import puppeteer from "puppeteer"
import { connectToDatabase } from "./mongodb"
import { extractEventsWithAI } from "./gemini"

// List of sites to scrape
const SCRAPE_SITES = [
  {
    name: "Eventbrite",
    url: "https://www.eventbrite.com.au/d/australia--sydney/all-events/",
    selector: ".search-event-card-square",
  },
  {
    name: "TimeOut",
    url: "https://www.timeout.com/sydney/things-to-do/things-to-do-in-sydney-this-weekend",
    selector: ".tile",
  },
  // Add more sites as needed
]

export async function scrapeEvents() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  const allEvents = []

  try {
    for (const site of SCRAPE_SITES) {
      console.log(`Scraping ${site.name}...`)

      const events = await scrapeSite(browser, site)
      allEvents.push(...events)

      console.log(`Found ${events.length} events from ${site.name}`)
    }

    // Store events in database
    await storeEvents(allEvents)

    return allEvents
  } finally {
    await browser.close()
  }
}

async function scrapeSite(browser, site) {
  const page = await browser.newPage()

  try {
    await page.goto(site.url, { waitUntil: "networkidle2", timeout: 60000 })

    // Try traditional scraping first
    let events = []

    try {
      // Wait for the selector to be available
      await page.waitForSelector(site.selector, { timeout: 10000 })

      // Extract events using traditional scraping
      events = await extractEventsTraditionally(page, site)
    } catch (error) {
      console.log(`Traditional scraping failed for ${site.name}, using AI fallback...`)

      // If traditional scraping fails, use AI fallback
      events = await extractEventsWithAIFallback(page, site)
    }

    return events
  } finally {
    await page.close()
  }
}

async function extractEventsTraditionally(page, site) {
  // This is a simplified example - you would need to customize this for each site
  if (site.name === "Eventbrite") {
    return await page.evaluate(() => {
      const events = []
      const eventCards = document.querySelectorAll(".search-event-card-square")

      eventCards.forEach((card) => {
        try {
          const title = card.querySelector(".event-card__title")?.textContent?.trim()
          const dateStr = card.querySelector(".event-card__date")?.textContent?.trim()
          const location = card.querySelector(".location-info__venue-name")?.textContent?.trim()
          const url = card.querySelector("a.event-card-link")?.href
          const image = card.querySelector("img")?.src

          if (title && dateStr && url) {
            events.push({
              title,
              date: dateStr,
              location: location || "Sydney",
              description: "",
              url,
              image,
              source: "Eventbrite",
              scrapedAt: new Date().toISOString(),
              usedAI: false,
            })
          }
        } catch (e) {
          console.error("Error parsing event card:", e)
        }
      })

      return events
    })
  } else if (site.name === "TimeOut") {
    return await page.evaluate(() => {
      const events = []
      const eventCards = document.querySelectorAll(".tile")

      eventCards.forEach((card) => {
        try {
          const title = card.querySelector("h3")?.textContent?.trim()
          const description = card.querySelector(".tile__content p")?.textContent?.trim()
          const url = card.querySelector("a")?.href
          const image = card.querySelector("img")?.src

          if (title && url) {
            events.push({
              title,
              date: "See website for dates",
              location: "Sydney",
              description: description || "",
              url,
              image,
              source: "TimeOut",
              scrapedAt: new Date().toISOString(),
              usedAI: false,
            })
          }
        } catch (e) {
          console.error("Error parsing event card:", e)
        }
      })

      return events
    })
  }

  return []
}

async function extractEventsWithAIFallback(page, site) {
  // Get the page content
  const content = await page.content()

  // Use Gemini AI to extract events
  const events = await extractEventsWithAI(content, site.name)

  // Mark these events as extracted using AI
  return events.map((event) => ({
    ...event,
    source: site.name,
    scrapedAt: new Date().toISOString(),
    usedAI: true,
  }))
}

async function storeEvents(events) {
  const { db } = await connectToDatabase()
  const collection = db.collection("events")

  // Process each event
  for (const event of events) {
    // Create a unique identifier based on title, date, and source
    const query = {
      title: event.title,
      source: event.source,
    }

    // Use upsert to avoid duplicates
    await collection.updateOne(query, { $set: event }, { upsert: true })
  }

  console.log(`Stored ${events.length} events in the database`)
}
