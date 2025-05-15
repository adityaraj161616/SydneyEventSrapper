"use client"

import { useState, useEffect } from "react"
import EventCard from "@/components/event-card"
import EventFilter from "@/components/event-filter"
import EmailModal from "@/components/email-modal"
import type { Event } from "@/types/event"

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showModal, setShowModal] = useState(false)
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
        const response = await fetch(`/api/events?filter=${filter.date}`)

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
          setEvents(data)
          setFilteredEvents(data)
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
  }, [filter.date])

  // Function to generate sample events when API fails
  const generateSampleEvents = (): Event[] => {
    const now = new Date(); // Get the current date once
    const threeDaysFromNow = new Date(now.getTime() + 86400000 * 3).toISOString();
    const fiveDaysFromNow = new Date(now.getTime() + 86400000 * 5).toISOString();
    const tenDaysFromNow = new Date(now.getTime() + 86400000 * 10).toISOString();

    return [
      {
        _id: "sample1",
        title: "Sydney Opera House Concert",
        date: threeDaysFromNow,
        time: "7:30 PM",
        location: "Sydney Opera House, Bennelong Point",
        description: "A spectacular evening of classical music featuring the Sydney Symphony Orchestra.",
        url: "https://www.sydneyoperahouse.com",
        image: "/placeholder.svg?height=200&width=400",
        category: "music",
        price: "From $85",
        source: "Sample",
        scrapedAt: now.toISOString(),
        usedAI: false,
      },
      {
        _id: "sample2",
        title: "Bondi Beach Festival",
        date: fiveDaysFromNow,
        time: "10:00 AM - 8:00 PM",
        location: "Bondi Beach, Sydney",
        description: "A day of fun in the sun with music, food stalls, and beach activities for the whole family.",
        url: "https://www.bondifestival.com.au",
        image: "/placeholder.svg?height=200&width=400",
        category: "family",
        price: "Free",
        source: "Sample",
        scrapedAt: now.toISOString(),
        usedAI: false,
      },
      {
        _id: "sample3",
        title: "Sydney Food & Wine Festival",
        date: tenDaysFromNow,
        time: "11:00 AM - 10:00 PM",
        location: "Darling Harbour, Sydney",
        description: "Taste the best of Sydney's culinary scene with food and wine from top restaurants and wineries.",
        url: "https://www.sydneyfoodandwine.com.au",
        image: "/placeholder.svg?height=200&width=400",
        category: "food",
        price: "$25",
        source: "Sample",
        scrapedAt: now.toISOString(),
        usedAI: false,
      },
    ];
  }

  // Add this function to the Home component
  const handleManualScrape = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/scrape")
      const data = await response.json()

      if (data.success) {
        alert(`Success: ${data.message}. Refreshing events...`)
        // Refresh events
        window.location.reload()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error("Error triggering scrape:", error)
      alert("Failed to trigger scraping")
    } finally {
      setLoading(false)
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
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const nextWeek = new Date(today)
      nextWeek.setDate(nextWeek.getDate() + 7)
      const nextMonth = new Date(today)
      nextMonth.setMonth(nextMonth.getMonth() + 1)

      result = result.filter((event) => {
        const eventDate = new Date(event.date)
        switch (filter.date) {
          case "today":
            return eventDate.toDateString() === today.toDateString()
          case "tomorrow":
            return eventDate.toDateString() === tomorrow.toDateString()
          case "week":
            return eventDate > today && eventDate <= nextWeek
          case "month":
            return eventDate > today && eventDate <= nextMonth
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
    <main className="main">
      <div className="container">
        <section className="hero-section">
          <h1 className="hero-title">Sydney Events</h1>
          <p className="hero-subtitle">
            Discover the best events happening in Sydney, automatically curated and updated daily.
          </p>
          <button onClick={handleManualScrape} className="button" style={{ marginTop: "1rem" }} disabled={loading}>
            {loading ? "Loading..." : "Manually Scrape Events"}
          </button>
        </section>

        <EventFilter onFilterChange={handleFilterChange} />

        {loading ? (
          <div className="loading-container">
            <svg
              className="loading-spinner animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : error ? (
          <div className="error-container">
            <h3 className="error-title">Error loading events</h3>
            <p className="error-message">{error}</p>
            <p>Using sample events instead.</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} onGetTickets={handleGetTickets} />
            ))}
          </div>
        ) : (
          <div className="no-events">
            <h3 className="no-events-title">No events found</h3>
            <p className="no-events-message">Try adjusting your filters or check back later for new events.</p>
          </div>
        )}
      </div>

      {showModal && selectedEvent && <EmailModal event={selectedEvent} onClose={handleCloseModal} />}
    </main>
  )
}
