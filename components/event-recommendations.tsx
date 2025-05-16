"use client"

import type React from "react"

import { useState } from "react"
import type { Event } from "@/types/event"

interface EventRecommendationsProps {
  events: Event[]
}

interface Recommendation {
  eventId: string
  explanation: string
}

export default function EventRecommendations({ events }: EventRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preferences, setPreferences] = useState({
    categories: ["music", "arts"],
    priceRange: "any",
    location: "Sydney CBD",
    dateRange: "weekend",
  })

  // Update the checkEventsForDateRange function to be more flexible with the "week" date range
  // and add more detailed logging

  // Replace the checkEventsForDateRange function with this improved version:
  const checkEventsForDateRange = (dateRange: string): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Start of day

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Calculate the end of the week (next Sunday)
    const endOfWeek = new Date(today)
    const dayOfWeek = endOfWeek.getDay()
    const daysUntilEndOfWeek = dayOfWeek === 0 ? 7 : 7 - dayOfWeek
    endOfWeek.setDate(endOfWeek.getDate() + daysUntilEndOfWeek)
    endOfWeek.setHours(23, 59, 59, 999) // End of day

    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    endOfMonth.setHours(23, 59, 59, 999) // End of day

    console.log(`Checking events for date range: ${dateRange}`)
    console.log(`Today: ${today.toISOString()}`)
    console.log(`End of week: ${endOfWeek.toISOString()}`)

    // Filter events based on date range
    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.date)
      eventDate.setHours(0, 0, 0, 0)

      switch (dateRange) {
        case "today":
          return eventDate.getTime() === today.getTime()
        case "tomorrow":
          return eventDate.getTime() === tomorrow.getTime()
        case "weekend":
          const day = eventDate.getDay()
          return (day === 0 || day === 6) && eventDate >= today // Saturday or Sunday
        case "week":
          // More flexible week filtering - any event between today and end of week
          return eventDate >= today && eventDate <= endOfWeek
        case "month":
          return eventDate >= today && eventDate <= endOfMonth
        default:
          return true
      }
    })

    console.log(`Found ${filteredEvents.length} events for date range: ${dateRange}`)

    // Log the first few events for debugging
    if (filteredEvents.length > 0) {
      console.log(
        "Sample events found:",
        filteredEvents.slice(0, 3).map((e) => ({
          title: e.title,
          date: e.date,
          formattedDate: new Date(e.date).toLocaleDateString(),
        })),
      )
    }

    return filteredEvents.length > 0
  }

  const getRecommendations = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if there are events for the selected date range
      if (!checkEventsForDateRange(preferences.dateRange)) {
        setError(`No events found for "${preferences.dateRange}". Try selecting a different date range.`)
        setLoading(false)
        return
      }

      // Format the date preferences to be more specific
      const formattedPreferences = {
        ...preferences,
        // Add a formatted date object that the API can use
        dateInfo: {
          type: preferences.dateRange,
          // Add today's date in ISO format for reference
          today: new Date().toISOString(),
        },
      }

      console.log("Sending recommendation request with preferences:", formattedPreferences)

      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preferences: formattedPreferences }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error occurred" }))
        throw new Error(errorData.error || "Failed to get recommendations")
      }

      const data = await response.json()

      if (!data.recommendations || data.recommendations.length === 0) {
        setError(`No recommendations found for your preferences. Try adjusting your filters.`)
        return
      }

      setRecommendations(data.recommendations || [])
    } catch (error) {
      console.error("Error getting recommendations:", error)
      setError(`Failed to get recommendations. ${error instanceof Error ? error.message : "Please try again."}`)
    } finally {
      setLoading(false)
    }
  }

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setPreferences((prev) => ({ ...prev, [name]: value }))
    // Reset error when preferences change
    setError(null)
    // Reset recommendations when preferences change
    setRecommendations([])
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    setPreferences((prev) => ({
      ...prev,
      categories: checked ? [...prev.categories, value] : prev.categories.filter((cat) => cat !== value),
    }))
    // Reset error when preferences change
    setError(null)
    // Reset recommendations when preferences change
    setRecommendations([])
  }

  const getEventById = (id: string) => {
    return events.find((event) => event._id === id)
  }

  // Get event counts for each date range to show in the UI
  const getEventCountForDateRange = (dateRange: string): number => {
    return checkEventsForDateRange(dateRange) ? 1 : 0 // Just check if there are any events
  }

  return (
    <div className="recommendations-container">
      <h2 className="recommendations-title">Personalized Recommendations</h2>

      <div className="preferences-form">
        <h3 className="preferences-title">Your Preferences</h3>

        <div className="preferences-grid">
          <div className="preference-group">
            <label className="preference-label">Categories</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  value="music"
                  checked={preferences.categories.includes("music")}
                  onChange={handleCategoryChange}
                />
                Music
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  value="arts"
                  checked={preferences.categories.includes("arts")}
                  onChange={handleCategoryChange}
                />
                Arts & Culture
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  value="food"
                  checked={preferences.categories.includes("food")}
                  onChange={handleCategoryChange}
                />
                Food & Drink
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  value="sports"
                  checked={preferences.categories.includes("sports")}
                  onChange={handleCategoryChange}
                />
                Sports
              </label>
            </div>
          </div>

          <div className="preference-group">
            <label className="preference-label" htmlFor="priceRange">
              Price Range
            </label>
            <select
              id="priceRange"
              name="priceRange"
              value={preferences.priceRange}
              onChange={handlePreferenceChange}
              className="preference-select"
            >
              <option value="any">Any Price</option>
              <option value="free">Free</option>
              <option value="low">Under $25</option>
              <option value="medium">$25 - $75</option>
              <option value="high">Over $75</option>
            </select>
          </div>

          <div className="preference-group">
            <label className="preference-label" htmlFor="dateRange">
              When
            </label>
            <select
              id="dateRange"
              name="dateRange"
              value={preferences.dateRange}
              onChange={handlePreferenceChange}
              className="preference-select"
            >
              <option value="today" disabled={getEventCountForDateRange("today") === 0}>
                Today {getEventCountForDateRange("today") === 0 ? "(No events)" : ""}
              </option>
              <option value="tomorrow" disabled={getEventCountForDateRange("tomorrow") === 0}>
                Tomorrow {getEventCountForDateRange("tomorrow") === 0 ? "(No events)" : ""}
              </option>
              <option value="weekend">This Weekend</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        <button
          className="button button-primary get-recommendations-button"
          onClick={getRecommendations}
          disabled={loading}
        >
          {loading ? "Getting Recommendations..." : "Get Recommendations"}
        </button>
      </div>

      {error && (
        <div className="recommendations-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="recommendations-error-icon"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="recommendations-list">
          <h3 className="recommendations-subtitle">Your Personalized Picks</h3>

          {recommendations.map((rec, index) => {
            const event = getEventById(rec.eventId)
            if (!event) return null

            return (
              <div key={index} className="recommendation-item">
                <div className="recommendation-event">
                  <h4 className="recommendation-title">{event.title}</h4>
                  <p className="recommendation-details">
                    {new Date(event.date).toLocaleDateString()} • {event.location}
                  </p>
                </div>
                <p className="recommendation-explanation">{rec.explanation}</p>
              </div>
            )
          })}
        </div>
      )}

      {loading && (
        <div className="recommendations-loading">
          <div className="loading-spinner"></div>
          <p>Analyzing your preferences...</p>
        </div>
      )}
    </div>
  )
}
