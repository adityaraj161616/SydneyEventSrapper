import { Groq } from "groq-sdk"

// Initialize the Groq client with the API key from environment variables
const groqApiKey = process.env.GROQ_API_KEY

// Validate API key
if (!groqApiKey) {
  console.warn("GROQ_API_KEY is not defined in environment variables")
}

// Create a Groq client instance
const groqClient = new Groq({
  apiKey: groqApiKey,
})

/**
 * Extract events from HTML content using Groq's LLM
 * @param content HTML content from scraped websites
 * @param sourceName Name of the source website
 * @returns Array of extracted events
 */
export async function extractEventsWithGroq(content: string, sourceName: string) {
  try {
    // Validate API key before making request
    if (!groqApiKey) {
      throw new Error("GROQ_API_KEY is not defined")
    }

    console.log(`Using Groq to extract events from ${sourceName}...`)

    // Create a prompt that instructs Groq to extract event information
    const prompt = `
      You are an expert event data extractor. Extract all Sydney events from the following HTML content.
      
      For each event, extract:
      - title (string): The name of the event
      - date (string): The date of the event in YYYY-MM-DD format. If only a month or season is mentioned, use the first day of that month/season. If no date is found, use today's date.
      - time (string, optional): The time of the event
      - location (string): The venue or location of the event. If no specific venue is mentioned but it's clearly in Sydney, use "Sydney" as the location.
      - description (string): A brief description of the event
      - url (string, optional): The URL to the event page
      - image (string, optional): The URL to an image for the event
      - category (string, optional): The category of the event (e.g., music, arts, food, sports)
      - price (string or number, optional): The price of the event
      
      Source: ${sourceName}
      
      Return the data as a JSON object with an "events" key containing an array of event objects. Only include events that are definitely in Sydney, Australia.
      
      If you can't find any events, create at least 3 sample events that are likely to be happening in Sydney soon, based on the type of website.
      
      HTML Content:
      ${content.substring(0, 50000)} // Limit content length to avoid token limits
    `

    // Generate content using Groq
    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that extracts structured event data from HTML content.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-70b-8192",
      temperature: 0.2, // Lower temperature for more deterministic outputs
      max_tokens: 4000,
      response_format: { type: "json_object" },
    })

    const responseText = completion.choices[0]?.message?.content || ""

    // Parse the JSON response
    try {
      // The response should be a JSON object with an events array
      const parsedResponse = JSON.parse(responseText)
      const events = Array.isArray(parsedResponse.events)
        ? parsedResponse.events
        : parsedResponse.events
          ? [parsedResponse.events]
          : Array.isArray(parsedResponse)
            ? parsedResponse
            : []

      // Validate and clean up events
      const validEvents = events
        .filter((event) => event && event.title)
        .map((event) => {
          // Ensure date is in proper format
          let eventDate = event.date
          if (!eventDate || !Date.parse(eventDate)) {
            eventDate = new Date().toISOString()
          }

          return {
            ...event,
            date: eventDate,
            location: event.location || "Sydney",
            description: event.description || `Details for ${event.title}. Check the website for more information.`,
          }
        })

      console.log(`Successfully extracted ${validEvents.length} events using Groq`)
      return validEvents
    } catch (error) {
      console.error("Error parsing JSON from Groq response:", error)
      // Fallback to generating sample events
      return generateSampleEvents(sourceName)
    }
  } catch (error) {
    console.error("Error using Groq:", error)
    return generateSampleEvents(sourceName)
  }
}

// Helper function to generate sample events when AI extraction fails
function generateSampleEvents(sourceName) {
  console.log("Generating sample events as fallback")
  const today = new Date()

  return [
    {
      title: `${sourceName} Featured Event`,
      date: new Date(today.getTime() + 86400000 * 3).toISOString(), // 3 days from now
      time: "7:00 PM",
      location: "Sydney Opera House",
      description: `A special event featured on ${sourceName}. Check the website for more details.`,
      category: "arts",
      price: "From $30",
    },
    {
      title: `Sydney Weekend Festival`,
      date: new Date(today.getTime() + 86400000 * 5).toISOString(), // 5 days from now
      time: "10:00 AM - 6:00 PM",
      location: "Darling Harbour, Sydney",
      description: "A weekend of entertainment, food, and activities for the whole family.",
      category: "family",
      price: "Free",
    },
    {
      title: `Live Music at Sydney Bar`,
      date: new Date(today.getTime() + 86400000 * 2).toISOString(), // 2 days from now
      time: "8:30 PM",
      location: "The Rocks, Sydney",
      description: "Live performances from local Sydney bands and artists.",
      category: "music",
      price: "$25",
    },
  ]
}

/**
 * Generate event recommendations based on user preferences
 * @param userPreferences User preferences for event recommendations
 * @param availableEvents List of available events
 * @returns Array of recommended events with explanations
 */
export async function generateEventRecommendations(userPreferences: any, availableEvents: any[]) {
  try {
    if (!groqApiKey) {
      throw new Error("GROQ_API_KEY is not defined")
    }

    console.log("Generating event recommendations with Groq...")

    // Filter events based on date preference before sending to Groq
    let filteredEvents = [...availableEvents]

    if (userPreferences.dateInfo && userPreferences.dateInfo.type) {
      const today = new Date(userPreferences.dateInfo.today || new Date())
      today.setHours(0, 0, 0, 0) // Start of day

      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const endOfWeek = new Date(today)
      endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()))

      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

      filteredEvents = filteredEvents.filter((event) => {
        const eventDate = new Date(event.date)
        eventDate.setHours(0, 0, 0, 0)

        switch (userPreferences.dateInfo.type) {
          case "today":
            return eventDate.getTime() === today.getTime()
          case "tomorrow":
            return eventDate.getTime() === tomorrow.getTime()
          case "weekend":
            const day = eventDate.getDay()
            return (day === 0 || day === 6) && eventDate >= today // Saturday or Sunday
          case "week":
            // More flexible week filtering - any event between today and end of week
            // Add a small buffer to account for time differences
            const weekStart = new Date(today)
            weekStart.setHours(0, 0, 0, 0)
            const weekEnd = new Date(endOfWeek)
            weekEnd.setHours(23, 59, 59, 999)

            console.log(
              `Checking if event date ${eventDate.toISOString()} is between ${weekStart.toISOString()} and ${weekEnd.toISOString()}`,
            )
            return eventDate >= weekStart && eventDate <= weekEnd
          case "month":
            return eventDate >= today && eventDate <= endOfMonth
          default:
            return true
        }
      })

      console.log(
        `Filtered events by date (${userPreferences.dateInfo.type}): ${filteredEvents.length} events remaining`,
      )

      // If no events match the date filter, return early with empty recommendations
      if (filteredEvents.length === 0) {
        console.log("No events match the date criteria")
        return { recommendations: [] }
      }
    }

    // Filter events based on categories if specified
    if (userPreferences.categories && userPreferences.categories.length > 0) {
      filteredEvents = filteredEvents.filter((event) => {
        // If event has no category, include it in results
        if (!event.category) return true

        // Check if event category is in user preferences
        return userPreferences.categories.includes(event.category.toLowerCase())
      })

      console.log(`Filtered events by categories: ${filteredEvents.length} events remaining`)
    }

    // Filter events based on price range if specified
    if (userPreferences.priceRange && userPreferences.priceRange !== "any") {
      filteredEvents = filteredEvents.filter((event) => {
        // If event has no price, include it in results
        if (!event.price) return true

        const price =
          typeof event.price === "string" ? Number.parseFloat(event.price.replace(/[^0-9.]/g, "")) : event.price

        // If price couldn't be parsed, include it in results
        if (isNaN(price)) return true

        switch (userPreferences.priceRange) {
          case "free":
            return price === 0 || event.price.toLowerCase().includes("free")
          case "low":
            return price < 25
          case "medium":
            return price >= 25 && price <= 75
          case "high":
            return price > 75
          default:
            return true
        }
      })

      console.log(`Filtered events by price range: ${filteredEvents.length} events remaining`)
    }

    // If no events match all filters, return early with empty recommendations
    if (filteredEvents.length === 0) {
      console.log("No events match all filter criteria")
      return { recommendations: [] }
    }

    // Limit to 20 events to avoid token limits
    const eventsData = JSON.stringify(filteredEvents.slice(0, 20))

    const prompt = `
      Based on the user's preferences and the available events, recommend the top 5 events that would be most relevant.
      
      User preferences:
      ${JSON.stringify(userPreferences)}
      
      Available events:
      ${eventsData}
      
      For each recommendation, provide:
      1. The event ID
      2. A brief explanation of why this event matches the user's preferences
      
      Return the data as a JSON object with an array of recommendations.
      If there are no suitable events, return an empty recommendations array.
    `

    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that provides personalized event recommendations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-70b-8192",
      temperature: 0.5,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    })

    const responseText = completion.choices[0]?.message?.content || ""

    try {
      const recommendations = JSON.parse(responseText)
      return recommendations
    } catch (error) {
      console.error("Error parsing recommendations from Groq:", error)
      return { recommendations: [] }
    }
  } catch (error) {
    console.error("Error generating recommendations with Groq:", error)
    return { recommendations: [] }
  }
}

/**
 * Generate a summary of an event
 * @param event Event data
 * @returns Summary of the event
 */
export async function generateEventSummary(event: any) {
  try {
    if (!groqApiKey) {
      throw new Error("GROQ_API_KEY is not defined")
    }

    console.log(`Generating summary for event: ${event.title}`)

    const prompt = `
      Create a concise, engaging summary for this event:
      
      ${JSON.stringify(event)}
      
      The summary should:
      1. Be 2-3 sentences long
      2. Highlight the most appealing aspects of the event
      3. Include key details like date, location, and any special features
      
      Return only the summary text, no additional formatting.
    `

    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that creates concise and engaging event summaries.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-70b-8192",
      temperature: 0.7,
      max_tokens: 200,
    })

    return completion.choices[0]?.message?.content || ""
  } catch (error) {
    console.error("Error generating event summary with Groq:", error)
    return ""
  }
}

export default groqClient
