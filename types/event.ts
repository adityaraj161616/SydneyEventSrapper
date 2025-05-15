export interface Event {
  _id: string
  title: string
  date: string
  time?: string
  location: string
  description: string
  url: string
  image?: string
  category?: string
  price?: string | number
  source: string
  scrapedAt: string
  usedAI?: boolean
}
