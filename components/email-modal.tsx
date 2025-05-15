"use client"

import type React from "react"
import { useState } from "react"
import type { Event } from "@/types/event"

interface EmailModalProps {
  event: Event
  onClose: () => void
}

export default function EmailModal({ event, onClose }: EmailModalProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          eventId: event._id,
          eventTitle: event.title,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit email")
      }

      setSuccess(true)

      // Redirect to event URL after a short delay
      setTimeout(() => {
        window.open(event.url, "_blank")
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Error submitting email:", error)
      setError("Failed to submit your email. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button onClick={onClose} className="modal-close">
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
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="modal-content">
          <h3 className="modal-title">Almost there!</h3>

          <p className="modal-subtitle">Enter your email to get tickets for:</p>

          <div className="event-info">
            <h4 className="event-info-title">{event.title}</h4>
            <p className="event-info-date">{new Date(event.date).toLocaleDateString("en-AU")}</p>
          </div>

          {success ? (
            <div className="success-message">Success! Redirecting you to the event page...</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  disabled={isSubmitting}
                />
                {error && <p className="error-message">{error}</p>}
              </div>

              <button type="submit" className="button" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Continue to Tickets"}
              </button>

              <p className="privacy-note">We'll never share your email with anyone else.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
