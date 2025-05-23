"use client";
import { useState } from "react";

type Event = {
  title: string;
  date: string;
  link: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/scrape");
      const data = await res.json();
      if (data.events) setEvents(data.events);
      else setError("No events found.");
    } catch (err) {
      setError("Failed to fetch events.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sydney Eventbrite Events</h1>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={fetchEvents}
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch Events"}
      </button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      <ul className="mt-6 space-y-4">
        {events.map((event, idx) => (
          <li key={idx} className="border p-4 rounded">
            <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-700 hover:underline">
              {event.title}
            </a>
            <div className="text-gray-600">{event.date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}