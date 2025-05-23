import axios from 'axios';
import cheerio from 'cheerio';
import { parseEventData } from './utils/parser';

export const scrapeEvents = async () => {
    try {
        const response = await axios.get('https://www.eventbrite.com/d/australia--sydney/events/');
        const html = response.data;
        const events = parseEventData(html);
        return events;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
};