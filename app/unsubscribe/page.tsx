"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"

export default function UnsubscribePage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          subscribe: false,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to unsubscribe")
      }

      setSuccess(true)
      setEmail("")
    } catch (error) {
      console.error("Error unsubscribing:", error)
      setError("Failed to unsubscribe. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container">
      <div className="unsubscribe-container">
        <h1 className="unsubscribe-title">Unsubscribe from Event Updates</h1>
        <p className="unsubscribe-description">
          We're sorry to see you go. Enter your email address below to unsubscribe from our event updates.
        </p>

        {success ? (
          <div className="unsubscribe-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="unsubscribe-icon"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h2 className="unsubscribe-success-title">Successfully Unsubscribed</h2>
            <p className="unsubscribe-success-message">
              You have been successfully unsubscribed from our event updates. You will no longer receive emails from us.
            </p>
            <Link href="/" className="button button-primary">
              Return to Home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="unsubscribe-form">
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
              {error && <p className="form-error">{error}</p>}
            </div>

            <button type="submit" className="button button-primary" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Unsubscribe"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
