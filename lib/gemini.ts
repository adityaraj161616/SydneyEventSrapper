import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API with the provided key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""

// Validate API key
if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not defined in environment variables")
}

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

export async function extractEventsWithAI(content, sourceName) {
  try {
    // Validate API key before making request
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined")
    }

    console.log(`Using Gemini AI to extract events from ${sourceName}...`)

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Create a prompt that instructs Gemini to extract event information
    const prompt = `
      You are an expert event data extractor. Extract all Sydney events from the following HTML content.
      
      For each event, extract:
      - title (string): The name of the event
      - date (string): The date of the event in YYYY-MM-DD format. If only a month or season is mentioned, use the first day of that month/season.
      - time (string, optional): The time of the event
      - location (string): The venue or location of the event
      - description (string): A brief description of the event
      - url (string, optional): The URL to the event page
      - image (string, optional): The URL to an image for the event
      - category (string, optional): The category of the event (e.g., music, arts, food, sports)
      - price (string or number, optional): The price of the event
      
      Source: ${sourceName}
      
      Return the data as a JSON array of event objects. Only include events that are definitely in Sydney, Australia.
      
      HTML Content:
      ${content.substring(0, 100000)} // Limit content length to avoid token limits
    `

    // Generate content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.error("No JSON found in AI response")
      return []
    }

    // Parse the JSON
    try {
      const events = JSON.parse(jsonMatch[0])
      console.log(`Successfully extracted ${events.length} events using Gemini AI`)
      return events
    } catch (error) {
      console.error("Error parsing JSON from AI response:", error)
      return []
    }
  } catch (error) {
    console.error("Error using Gemini AI:", error)
    return []
  }
}
