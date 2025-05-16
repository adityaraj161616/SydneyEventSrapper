"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import type { Event } from "@/types/event"

interface EventCardProps {
  event: Event
  onGetTickets: (event: Event) => void
}

export default function EventCard({ event, onGetTickets }: EventCardProps) {
  const [imageError, setImageError] = useState(false)
  const [summary, setSummary] = useState("")
  const [loadingSummary, setLoadingSummary] = useState(false)

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString("en-AU", options)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleGetTickets = (e: React.MouseEvent) => {
    e.preventDefault()
    onGetTickets(event)
  }

  useEffect(() => {
    // Only fetch summary for AI-generated events
    if (event.usedAI && !summary) {
      fetchEventSummary()
    }
  }, [event])

  const fetchEventSummary = async () => {
    try {
      setLoadingSummary(true)
      const response = await fetch(`/api/summary?id=${event._id}`)

      if (response.ok) {
        const data = await response.json()
        if (data.summary) {
          setSummary(data.summary)
        }
      }
    } catch (error) {
      console.error("Error fetching event summary:", error)
    } finally {
      setLoadingSummary(false)
    }
  }

  return (
    <div className="event-card">
      <div className="event-card-image">
        {!imageError ? (
          <Image
            src={event.image || `/placeholder.svg?height=200&width=400`}
            alt={event.title}
            fill
            style={{ objectFit: "cover" }}
            onError={handleImageError}
          />
        ) : (
          <div className="image-fallback">
            <span>Image unavailable</span>
          </div>
        )}
        {event.category && <span className="event-card-category">{event.category}</span>}
        {event.usedAI && (
          <div className="event-card-ai-badge">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Zm0 12.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
            </svg>
            <span>AI Enhanced</span>
          </div>
        )}
      </div>

      <div className="event-card-content">
        <div className="event-card-date">
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
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>{formatDate(event.date)}</span>
        </div>

        <h3 className="event-card-title">{event.title}</h3>

        <div className="event-card-details">
          {event.time && (
            <div className="event-card-detail">
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
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{event.time}</span>
            </div>
          )}

          <div className="event-card-detail">
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
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{event.location}</span>
          </div>

          {event.price && (
            <div className="event-card-detail">
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
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              <span>{typeof event.price === "number" ? `$${event.price.toFixed(2)}` : event.price}</span>
            </div>
          )}
        </div>

        <p className="event-card-description">
          {summary || event.description}
          {loadingSummary && <span className="summary-loading">Loading enhanced description...</span>}
        </p>

        <div className="event-card-footer">
          <button className="button button-primary event-card-button" onClick={handleGetTickets}>
            Get Tickets
          </button>
        </div>
      </div>
    </div>
  )
}
