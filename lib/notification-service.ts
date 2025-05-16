import { connectToDatabase } from "./mongodb"
import type { Event } from "@/types/event"

/**
 * Sends notifications to subscribers about new events
 * @param newEvents Array of newly added events
 */
export async function notifySubscribersAboutNewEvents(newEvents: Event[]) {
  if (newEvents.length === 0) {
    console.log("No new events to notify subscribers about")
    return
  }

  try {
    const { db } = await connectToDatabase()

    // Get all subscribers
    const subscribers = await db.collection("subscribers").find({}).toArray()

    if (subscribers.length === 0) {
      console.log("No subscribers to notify")
      return
    }

    console.log(`Notifying ${subscribers.length} subscribers about ${newEvents.length} new events`)

    // In a real application, you would integrate with an email service like SendGrid, Mailchimp, etc.
    // For this example, we'll just log the notifications

    for (const subscriber of subscribers) {
      console.log(`Would send email to ${subscriber.email} about ${newEvents.length} new events`)

      // Example of what you would do with an email service:
      /*
      await sendEmail({
        to: subscriber.email,
        subject: `${newEvents.length} New Events in Sydney!`,
        html: generateNewEventsEmailTemplate(newEvents),
      })
      */
    }

    // Record that notifications were sent
    await db.collection("notification_logs").insertOne({
      timestamp: new Date(),
      subscriberCount: subscribers.length,
      eventCount: newEvents.length,
      eventIds: newEvents.map((event) => event._id),
    })

    console.log("Notifications sent successfully")
  } catch (error) {
    console.error("Error sending notifications:", error)
  }
}

/**
 * Example function to generate an HTML email template for new events
 * @param events Array of new events
 * @returns HTML string for email
 */
function generateNewEventsEmailTemplate(events: Event[]): string {
  // This would be a proper HTML email template in a real application
  return `
    <h1>New Events in Sydney!</h1>
    <p>We've found ${events.length} new events that might interest you:</p>
    <ul>
      ${events
        .map(
          (event) => `
        <li>
          <strong>${event.title}</strong> - ${new Date(event.date).toLocaleDateString()}
          <p>${event.description}</p>
        </li>
      `,
        )
        .join("")}
    </ul>
    <p>
      <a href="https://sydneyevents.com">View all events</a>
    </p>
    <p>
      <small>
        You're receiving this email because you subscribed to event updates.
        <a href="https://sydneyevents.com/unsubscribe">Unsubscribe</a>
      </small>
    </p>
  `
}
