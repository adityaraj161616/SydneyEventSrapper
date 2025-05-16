"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className={`site-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="container header-container">
        <Link href="/" className="site-logo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"></path>
          </svg>
          <span>Sydney Events</span>
        </Link>

        <nav className="site-nav">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/events">Events</Link>
            </li>
            <li>
              <Link href="/categories">Categories</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/admin">Admin</Link>
            </li>
          </ul>
        </nav>

        <button className="mobile-menu-button" onClick={toggleMenu} aria-label="Toggle menu">
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
            {isMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>

        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
          <ul>
            <li>
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/events" onClick={() => setIsMenuOpen(false)}>
                Events
              </Link>
            </li>
            <li>
              <Link href="/categories" onClick={() => setIsMenuOpen(false)}>
                Categories
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
