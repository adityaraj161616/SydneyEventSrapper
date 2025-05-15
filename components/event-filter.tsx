"use client"

import type React from "react"
import { useState } from "react"

interface EventFilterProps {
  onFilterChange: (filter: any) => void
}

export default function EventFilter({ onFilterChange }: EventFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [location, setLocation] = useState("")

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value)
  }

  const handleLocationSubmit = () => {
    onFilterChange({ location: location || "all" })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLocationSubmit()
    }
  }

  return (
    <div className="filter-container">
      <div className="filter-header">
        <h2 className="filter-title">Filter Events</h2>
        <button className="button button-outline filter-toggle" onClick={() => setIsOpen(!isOpen)}>
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
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          {isOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className="filter-grid" style={{ display: isOpen ? "grid" : "none" }}>
        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select className="select" onChange={(e) => onFilterChange({ category: e.target.value })} defaultValue="all">
            <option value="all">All Categories</option>
            <option value="music">Music</option>
            <option value="arts">Arts & Culture</option>
            <option value="food">Food & Drink</option>
            <option value="sports">Sports</option>
            <option value="family">Family</option>
            <option value="nightlife">Nightlife</option>
            <option value="business">Business</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Date</label>
          <select className="select" onChange={(e) => onFilterChange({ date: e.target.value })} defaultValue="all">
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Location</label>
          <div className="location-search">
            <input
              type="text"
              placeholder="Enter location..."
              value={location}
              onChange={handleLocationChange}
              onKeyDown={handleKeyDown}
              className="input location-input"
            />
            <button onClick={handleLocationSubmit} className="button location-button">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
