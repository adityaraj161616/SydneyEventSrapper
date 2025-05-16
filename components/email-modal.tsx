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
  const [isSubscribed, setIsSubscribed] = useState(true)
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
          isSubscribed,
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
    <div className="modal-overlay" style={{ opacity: 1, visibility: "visible" }}>
      <div className="modal" style={{ transform: "scale(1)", opacity: 1 }}>
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
            <div className="success-message">
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
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>Success! Redirecting you to the event page...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  disabled={isSubmitting}
                />
                {error && (
                  <p className="form-error">
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
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    {error}
                  </p>
                )}
              </div>

              <div className="form-checkbox">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isSubscribed}
                    onChange={(e) => setIsSubscribed(e.target.checked)}
                    disabled={isSubmitting}
                  />
                  <span>Keep me updated about similar events and offers (you can unsubscribe at any time)</span>
                </label>
              </div>

              <button type="submit" className="button button-primary" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Continue to Tickets"}
              </button>

              <p className="privacy-note">
                We'll never share your email with anyone else. By continuing, you agree to our{" "}
                <a href="/privacy" className="text-primary">
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
