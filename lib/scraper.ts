import puppeteer from "puppeteer"
import { connectToDatabase } from "./mongodb"
import { extractEventsWithGroq } from "./groq"
import { notifySubscribersAboutNewEvents } from "./notification-service"

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
  console.log("Starting event scraping process...")

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
  } catch (error) {
    console.error("Error during scraping process:", error)
    throw error
  } finally {
    await browser.close()
    console.log("Browser closed.")
  }
}

async function scrapeSite(browser, site) {
  const page = await browser.newPage()

  // Set a reasonable viewport size
  await page.setViewport({ width: 1280, height: 800 })

  // Set user agent to avoid being detected as a bot
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  )

  try {
    console.log(`Navigating to ${site.url}...`)

    // Add timeout and wait until options
    await page.goto(site.url, {
      waitUntil: ["networkidle2", "domcontentloaded"],
      timeout: 60000,
    })

    console.log(`Page loaded: ${site.url}`)

    // Try traditional scraping first
    let events = []

    try {
      // Wait for the selector to be available with increased timeout
      console.log(`Waiting for selector: ${site.selector}...`)
      await page.waitForSelector(site.selector, { timeout: 15000, visible: true })
      console.log(`Selector found, extracting events traditionally...`)

      // Extract events using traditional scraping
      events = await extractEventsTraditionally(page, site)
      console.log(`Traditional scraping found ${events.length} events`)

      // If no events found with traditional scraping, fall back to AI
      if (events.length === 0) {
        console.log(`No events found with traditional scraping for ${site.name}, using AI fallback...`)
        events = await extractEventsWithAIFallback(page, site)
      }
    } catch (error) {
      console.log(`Traditional scraping failed for ${site.name}, using AI fallback...`)
      console.error("Traditional scraping error:", error)

      // If traditional scraping fails, use AI fallback
      events = await extractEventsWithAIFallback(page, site)
      console.log(`AI fallback found ${events.length} events`)
    }

    return events
  } catch (error) {
    console.error(`Error scraping ${site.name}:`, error)
    // Even if navigation fails, try AI extraction with whatever content we have
    try {
      const content = await page.content()
      const events = await extractEventsWithGroq(content, site.name)
      return events.map((event) => ({
        ...event,
        source: site.name,
        scrapedAt: new Date().toISOString(),
        usedAI: true,
      }))
    } catch (e) {
      console.error("Failed to extract with AI after navigation error:", e)
      return []
    }
  } finally {
    await page.close()
    console.log(`Page closed for ${site.name}`)
  }
}

async function extractEventsTraditionally(page, site) {
  // This is a simplified example - you would need to customize this for each site
  if (site.name === "Eventbrite") {
    return await page.evaluate(() => {
      const events = []
      const eventCards = document.querySelectorAll(".search-event-card-square")
      console.log(`Found ${eventCards.length} event cards on Eventbrite`)

      eventCards.forEach((card, index) => {
        try {
          const title = card.querySelector(".event-card__title")?.textContent?.trim()
          const dateStr = card.querySelector(".event-card__date")?.textContent?.trim()
          const location = card.querySelector(".location-info__venue-name")?.textContent?.trim()
          const url = card.querySelector("a.event-card-link")?.href
          const image = card.querySelector("img")?.src
          const description =
            card.querySelector(".event-card__description")?.textContent?.trim() ||
            `Event details for ${title}. Check the website for more information.`

          if (title && url) {
            // Convert dateStr to ISO format (more robust approach)
            let date = new Date().toISOString()
            if (dateStr) {
              try {
                // Try to parse the date string
                // Handle various date formats
                const dateMatch = dateStr.match(/([A-Za-z]+)\s+(\d+)/)
                if (dateMatch) {
                  const month = dateMatch[1]
                  const day = dateMatch[2]
                  const year = new Date().getFullYear()
                  const monthIndex = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ].findIndex((m) => month.startsWith(m))

                  if (monthIndex !== -1) {
                    const parsedDate = new Date(year, monthIndex, Number.parseInt(day))
                    if (!isNaN(parsedDate.getTime())) {
                      date = parsedDate.toISOString()
                    }
                  }
                } else {
                  // Try direct parsing
                  const parsedDate = new Date(dateStr)
                  if (!isNaN(parsedDate.getTime())) {
                    date = parsedDate.toISOString()
                  }
                }
              } catch (e) {
                // If date parsing fails, keep the default (today)
                console.error(`Failed to parse date: ${dateStr}`)
              }
            }

            events.push({
              title,
              date,
              location: location || "Sydney",
              description,
              url,
              image,
              source: "Eventbrite",
              scrapedAt: new Date().toISOString(),
              usedAI: false,
            })
          }
        } catch (e) {
          console.error(`Error parsing event card ${index}:`, e)
        }
      })

      return events
    })
  } else if (site.name === "TimeOut") {
    return await page.evaluate(() => {
      const events = []
      const eventCards = document.querySelectorAll(".tile")
      console.log(`Found ${eventCards.length} event cards on TimeOut`)

      eventCards.forEach((card, index) => {
        try {
          const title = card.querySelector("h3")?.textContent?.trim()
          const description = card.querySelector(".tile__content p")?.textContent?.trim()
          const url = card.querySelector("a")?.href
          const image = card.querySelector("img")?.src
          const dateElement = card.querySelector(".tile__date")?.textContent?.trim()

          if (title && url) {
            // Try to parse date if available
            let eventDate = new Date()
            if (dateElement) {
              try {
                // TimeOut often uses formats like "Until Sep 30" or "Friday August 25"
                const dateMatch = dateElement.match(/([A-Za-z]+)\s+(\d+)/)
                if (dateMatch) {
                  const month = dateMatch[1]
                  const day = dateMatch[2]
                  const year = new Date().getFullYear()
                  const monthIndex = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ].findIndex((m) => month.startsWith(m))

                  if (monthIndex !== -1) {
                    eventDate = new Date(year, monthIndex, Number.parseInt(day))
                  }
                }
              } catch (e) {
                console.error(`Failed to parse TimeOut date: ${dateElement}`)
              }
            } else {
              // Set date to next weekend if no date found
              const today = new Date()
              eventDate = new Date(today)
              // Set to next Saturday
              eventDate.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7))
            }

            events.push({
              title,
              date: eventDate.toISOString(),
              location: "Sydney",
              description: description || `Details for ${title}. Check the website for more information.`,
              url,
              image,
              category: "arts", // Default category for TimeOut
              source: "TimeOut",
              scrapedAt: new Date().toISOString(),
              usedAI: false,
            })
          }
        } catch (e) {
          console.error(`Error parsing event card ${index}:`, e)
        }
      })

      return events
    })
  }

  return []
}

async function extractEventsWithAIFallback(page, site) {
  // Get the page content
  console.log("Getting page content for AI processing...")
  const content = await page.content()
  console.log(`Got ${content.length} characters of content`)

  // Use Groq AI to extract events
  const events = await extractEventsWithGroq(content, site.name)

  // Mark these events as extracted using AI
  return events.map((event) => ({
    ...event,
    source: site.name,
    scrapedAt: new Date().toISOString(),
    usedAI: true,
  }))
}

async function storeEvents(events) {
  if (events.length === 0) {
    console.log("No events to store in database")
    return
  }

  try {
    console.log(`Storing ${events.length} events in database...`)
    const { db } = await connectToDatabase()
    const collection = db.collection("events")

    // Process each event
    let insertedCount = 0
    let updatedCount = 0
    const newEvents = []

    for (const event of events) {
      // Create a unique identifier based on title and source
      const query = {
        title: event.title,
        source: event.source,
      }

      // Use upsert to avoid duplicates
      const result = await collection.updateOne(query, { $set: event }, { upsert: true })

      if (result.upsertedCount > 0) {
        insertedCount++
        // This is a new event, add it to the list for notifications
        newEvents.push({
          ...event,
          _id: result.upsertedId._id.toString(),
        })
      } else if (result.modifiedCount > 0) {
        updatedCount++
      }
    }

    console.log(`Database update complete: ${insertedCount} new events inserted, ${updatedCount} events updated`)

    // Notify subscribers about new events
    if (newEvents.length > 0) {
      await notifySubscribersAboutNewEvents(newEvents)
    }

    return events
  } catch (error) {
    console.error("Error storing events in database:", error)
    throw error
  }
}
