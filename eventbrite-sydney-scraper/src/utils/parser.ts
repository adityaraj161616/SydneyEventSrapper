import cheerio from 'cheerio';

export function parseEventData(html: string) {
    const $ = cheerio.load(html);
    const events: Array<{ title: string; date: string; location: string }> = [];

    $('.eds-event-card-content__primary-content').each((index, element) => {
        const title = $(element).find('.eds-event-card-content__title').text().trim();
        const date = $(element).find('.eds-text-bs').text().trim();
        const location = $(element).find('.eds-event-card-content__sub-title').text().trim();

        if (title && date && location) {
            events.push({ title, date, location });
        }
    });

    return events;
}