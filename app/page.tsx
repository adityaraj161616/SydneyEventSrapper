"use client"

import { useState, useEffect } from "react"
import EventCard from "@/components/event-card"
import EventFilter from "@/components/event-filter"
import EmailModal from "@/components/email-modal"
import EventRecommendations from "@/components/event-recommendations"
import type { Event } from "@/types/event"

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [scraping, setScraping] = useState(false)
  const [filter, setFilter] = useState({
    category: "all",
    date: "all",
    location: "all",
  })

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("Fetching events...")
        const response = await fetch("/api/events")

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log(`Fetched ${data.length} events:`, data)

        // Add some sample events if no events are returned
        if (data.length === 0) {
          console.log("No events returned from API, adding sample events")
          const sampleEvents = generateSampleEvents()
          setEvents(sampleEvents)
          setFilteredEvents(sampleEvents)
        } else {
          // Sort events by date (upcoming first)
          const sortedEvents = [...data].sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime()
          })

          setEvents(sortedEvents)
          setFilteredEvents(sortedEvents)
        }
      } catch (error) {
        console.error("Error fetching events:", error)
        setError(`Failed to fetch events: ${error instanceof Error ? error.message : String(error)}`)

        // Add sample events as fallback
        const sampleEvents = generateSampleEvents()
        setEvents(sampleEvents)
        setFilteredEvents(sampleEvents)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Update the sample events generation to ensure we have events for the current week

  // Find the generateSampleEvents function and replace it with this version:
  const generateSampleEvents = (): Event[] => {
    const today = new Date()

    // Calculate days for this week
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    const daysUntilWednesday = dayOfWeek <= 3 ? 3 - dayOfWeek : 10 - dayOfWeek // Get next Wednesday or this Wednesday
    const daysUntilFriday = dayOfWeek <= 5 ? 5 - dayOfWeek : 12 - dayOfWeek // Get next Friday or this Friday

    const wednesday = new Date(today)
    wednesday.setDate(today.getDate() + daysUntilWednesday)

    const friday = new Date(today)
    friday.setDate(today.getDate() + daysUntilFriday)

    return [
      {
        _id: "sample1",
        title: "Sydney Opera House Concert",
        date: new Date(today.getTime()).toISOString(), // Today
        time: "7:30 PM",
        location: "Sydney Opera House, Bennelong Point",
        description: "A spectacular evening of classical music featuring the Sydney Symphony Orchestra.",
        url: "https://www.sydneyoperahouse.com",
        image: "/placeholder.svg?height=200&width=400",
        category: "music",
        price: "From $85",
        source: "Sample",
        scrapedAt: new Date().toISOString(),
        usedAI: false,
      },
      {
        _id: "sample2",
        title: "Bondi Beach Festival",
        date: friday.toISOString(), // This Friday
        time: "10:00 AM - 8:00 PM",
        location: "Bondi Beach, Sydney",
        description: "A day of fun in the sun with music, food stalls, and beach activities for the whole family.",
        url: "https://www.bondifestival.com.au",
        image: "/placeholder.svg?height=200&width=400",
        category: "family",
        price: "Free",
        source: "Sample",
        scrapedAt: new Date().toISOString(),
        usedAI: false,
      },
      {
        _id: "sample3",
        title: "Sydney Food & Wine Festival",
        date: new Date(today.getTime() + 86400000 * 10).toISOString(), // 10 days from now
        time: "11:00 AM - 10:00 PM",
        location: "Darling Harbour, Sydney",
        description: "Taste the best of Sydney's culinary scene with food and wine from top restaurants and wineries.",
        url: "https://www.sydneyfoodandwine.com.au",
        image: "/placeholder.svg?height=200&width=400",
        category: "food",
        price: "$25",
        source: "Sample",
        scrapedAt: new Date().toISOString(),
        usedAI: false,
      },
      {
        _id: "sample4",
        title: "Sydney Art Exhibition",
        date: wednesday.toISOString(), // This Wednesday
        time: "9:00 AM - 5:00 PM",
        location: "Art Gallery of NSW, Sydney",
        description:
          "Explore contemporary Australian art in this special exhibition featuring works from emerging artists.",
        url: "https://www.artgallery.nsw.gov.au",
        image: "/placeholder.svg?height=200&width=400",
        category: "arts",
        price: "$15",
        source: "Sample",
        scrapedAt: new Date().toISOString(),
        usedAI: false,
      },
      {
        _id: "sample5",
        title: "Sydney Harbour Bridge Climb",
        date: new Date(today.getTime() + 86400000 * 1).toISOString(), // Tomorrow
        time: "Various times available",
        location: "Sydney Harbour Bridge, Sydney",
        description: "Experience breathtaking views of Sydney from the top of the iconic Harbour Bridge.",
        url: "https://www.bridgeclimb.com",
        image: "/placeholder.svg?height=200&width=400",
        category: "sports",
        price: "From $168",
        source: "Sample",
        scrapedAt: new Date().toISOString(),
        usedAI: false,
      },
      {
        _id: "sample6",
        title: "Comedy Night at Sydney Comedy Club",
        date: new Date(today.getTime() + 86400000 * 2).toISOString(), // 2 days from now
        time: "8:00 PM",
        location: "Sydney Comedy Club, The Rocks",
        description: "Laugh the night away with Australia's top comedians at Sydney's premier comedy venue.",
        url: "https://www.sydneycomedyclub.com.au",
        image: "/placeholder.svg?height=200&width=400",
        category: "nightlife",
        price: "$30",
        source: "Sample",
        scrapedAt: new Date().toISOString(),
        usedAI: false,
      },
    ]
  }

  // Add this function to the Home component
  const handleManualScrape = async () => {
    try {
      setScraping(true)
      setError(null)

      console.log("Manually triggering scrape...")
      const response = await fetch("/api/scrape")

      if (!response.ok) {
        throw new Error(`Failed to trigger scrape: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        alert(`Success: ${data.message}. Refreshing events...`)
        // Refresh events
        window.location.reload()
      } else {
        throw new Error(data.error || "Unknown error occurred")
      }
    } catch (error) {
      console.error("Error triggering scrape:", error)
      setError(`Failed to trigger scraping: ${error instanceof Error ? error.message : String(error)}`)
      alert(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setScraping(false)
    }
  }

  useEffect(() => {
    // Apply filters
    console.log("Applying filters:", filter)
    let result = [...events]

    if (filter.category !== "all") {
      result = result.filter((event) => event.category === filter.category)
    }

    if (filter.date !== "all") {
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Set to beginning of day for accurate comparison

      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const nextWeek = new Date(today)
      nextWeek.setDate(nextWeek.getDate() + 7)

      const nextMonth = new Date(today)
      nextMonth.setMonth(nextMonth.getMonth() + 1)

      result = result.filter((event) => {
        // Parse the event date and normalize to beginning of day
        const eventDate = new Date(event.date)
        eventDate.setHours(0, 0, 0, 0)

        switch (filter.date) {
          case "today":
            return eventDate.getTime() === today.getTime()
          case "tomorrow":
            return eventDate.getTime() === tomorrow.getTime()
          case "week":
            return eventDate >= today && eventDate <= nextWeek
          case "month":
            return eventDate >= today && eventDate <= nextMonth
          default:
            return true
        }
      })
    }

    if (filter.location !== "all") {
      result = result.filter((event) => event.location.toLowerCase().includes(filter.location.toLowerCase()))
    }

    console.log(`Filtered from ${events.length} to ${result.length} events`)
    setFilteredEvents(result)
  }, [filter, events])

  const handleGetTickets = (event: Event) => {
    console.log("Get tickets clicked for event:", event.title)
    setSelectedEvent(event)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedEvent(null)
  }

  const handleFilterChange = (newFilter: any) => {
    setFilter({ ...filter, ...newFilter })
  }

  return (
    <main>
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Discover Sydney's Best Events</h1>
            <p className="hero-subtitle">
              Find concerts, festivals, exhibitions, and more happening in Sydney, automatically curated and updated
              daily.
            </p>
            <div className="hero-actions">
              <button
                onClick={handleManualScrape}
                className="button button-primary button-lg button-icon"
                disabled={scraping || loading}
              >
                {scraping ? (
                  <>
                    <svg
                      className="animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                    </svg>
                    Scraping Events...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                    </svg>
                    Refresh Events
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <section className="filter-section">
          <EventFilter onFilterChange={handleFilterChange} />
        </section>

        {!loading && !error && events.length > 0 && (
          <section className="recommendations-section">
            <EventRecommendations events={events} />
          </section>
        )}

        <section className="events-section">
          <div className="container">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading events...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <svg
                  className="error-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3 className="error-title">Error loading events</h3>
                <p className="error-message">{error}</p>
                <p>Using sample events instead.</p>
              </div>
            ) : (
              <>
                <div className="events-header">
                  <h2 className="events-title">Upcoming Events</h2>
                  <p className="events-count">{filteredEvents.length} events found</p>
                </div>

                {filteredEvents.length > 0 ? (
                  <div className="events-grid">
                    {filteredEvents.map((event) => (
                      <EventCard key={event._id} event={event} onGetTickets={handleGetTickets} />
                    ))}
                  </div>
                ) : (
                  <div className="empty-container">
                    <svg
                      className="empty-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M8 15h8"></path>
                      <path d="M9 9h.01"></path>
                      <path d="M15 9h.01"></path>
                    </svg>
                    <h3 className="empty-title">No events found</h3>
                    <p className="empty-message">Try adjusting your filters or check back later for new events.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      {showModal && selectedEvent && <EmailModal event={selectedEvent} onClose={handleCloseModal} />}
    </main>
  )
}
