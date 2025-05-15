"use client"

import { useState, useEffect } from "react"
import type { Event } from "@/types/event"

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [scraping, setScraping] = useState(false)
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState("events")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch events
      const eventsResponse = await fetch("/api/events")
      const eventsData = await eventsResponse.json()
      setEvents(eventsData)

      // Fetch subscriptions
      const subscriptionsResponse = await fetch("/api/subscriptions")
      const subscriptionsData = await subscriptionsResponse.json()
      setSubscriptions(subscriptionsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      setMessage("Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  const handleManualScrape = async () => {
    setScraping(true)
    setMessage("")

    try {
      const response = await fetch("/api/scrape")
      const data = await response.json()

      if (data.success) {
        setMessage(`Success: ${data.message}`)
        // Refresh events after scraping
        fetchData()
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error("Error triggering scrape:", error)
      setMessage("Failed to trigger scraping")
    } finally {
      setScraping(false)
    }
  }

  return (
    <div className="admin-container container">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h2 className="stat-title">Total Events</h2>
          </div>
          <div className="stat-content">
            <p className="stat-value">{events.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h2 className="stat-title">AI-Generated Events</h2>
          </div>
          <div className="stat-content">
            <p className="stat-value">{events.filter((e) => e.usedAI).length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h2 className="stat-title">Email Subscriptions</h2>
          </div>
          <div className="stat-content">
            <p className="stat-value">{subscriptions.length}</p>
          </div>
        </div>
      </div>

      <div className="actions-section">
        <div className="actions-header">
          <h2 className="actions-title">Actions</h2>
        </div>

        <div className="actions-container">
          <button onClick={handleManualScrape} className="button" disabled={scraping}>
            {scraping ? (
              <>
                <svg
                  className="animate-spin"
                  style={{ marginRight: "0.5rem", height: "1rem", width: "1rem" }}
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
                Scraping...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: "0.5rem" }}
                >
                  <path d="M23 4v6h-6"></path>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
                Manual Scrape
              </>
            )}
          </button>

          {message && (
            <div className={`message ${message.startsWith("Success") ? "message-success" : "message-error"}`}>
              {message}
            </div>
          )}
        </div>
      </div>

      <div className="tabs">
        <div className="tabs-list">
          <div className={`tab ${activeTab === "events" ? "tab-active" : ""}`} onClick={() => setActiveTab("events")}>
            Events
          </div>
          <div
            className={`tab ${activeTab === "subscriptions" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("subscriptions")}
          >
            Subscriptions
          </div>
        </div>

        <div className="tab-content">
          {activeTab === "events" &&
            (loading ? (
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
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Date</th>
                      <th>Source</th>
                      <th>AI Used</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event._id}>
                        <td>{event.title}</td>
                        <td>{new Date(event.date).toLocaleDateString()}</td>
                        <td>{event.source}</td>
                        <td>
                          {event.usedAI ? (
                            <span className="badge badge-yellow">AI Generated</span>
                          ) : (
                            <span className="badge badge-green">Traditional</span>
                          )}
                        </td>
                        <td>
                          <button className="icon-button">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

          {activeTab === "subscriptions" &&
            (loading ? (
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
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Event</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((sub) => (
                      <tr key={sub._id}>
                        <td>{sub.email}</td>
                        <td>{sub.eventTitle}</td>
                        <td>{new Date(sub.timestamp).toLocaleString()}</td>
                        <td>
                          <button className="icon-button">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
