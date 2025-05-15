export function filterEventsByDate(events: any[], filter: string): any[] {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  if (filter === "all") {
    return events; // Return all events
  } else if (filter === "tomorrow") {
    return events.filter((event) => {
      const eventDate = new Date(event.date); // Ensure event.date is in a valid date format
      return (
        eventDate >= startOfTomorrow &&
        eventDate < new Date(startOfTomorrow.getTime() + 24 * 60 * 60 * 1000)
      );
    });
  }

  // Add more filters as needed (e.g., "this week", "this month")
  return [];
}