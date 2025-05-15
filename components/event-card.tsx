"use client"

import { useState } from "react"
import Image from "next/image"
import type { Event } from "@/types/event"

interface EventCardProps {
  event: Event
  onGetTickets: (event: Event) => void
}

export default function EventCard({ event, onGetTickets }: EventCardProps) {
  const [imageError, setImageError] = useState(false)

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
      </div>

      <div className="event-card-header">
        <h3 className="event-card-title">{event.title}</h3>
      </div>

      <div className="event-card-content">
        <div className="event-card-details">
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>{formatDate(event.date)}</span>
          </div>

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
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
              <span>{typeof event.price === "number" ? `$${event.price.toFixed(2)}` : event.price}</span>
            </div>
          )}
        </div>

        <p className="event-card-description">{event.description}</p>
      </div>

      <div className="event-card-footer">
        <button className="button event-card-button" onClick={() => onGetTickets(event)}>
          Get Tickets
        </button>
      </div>
    </div>
  )
}
