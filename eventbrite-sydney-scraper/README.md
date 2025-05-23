# Eventbrite Sydney Scraper

This project is a web scraper designed to extract event data from the Eventbrite Sydney events page. It utilizes TypeScript for type safety and clarity, and employs libraries such as Axios for HTTP requests and Cheerio for parsing HTML.

## Project Structure

```
eventbrite-sydney-scraper
├── src
│   ├── scraper.ts         # Main entry point for web scraping functionality
│   └── utils
│       └── parser.ts      # Utility for parsing HTML and extracting event data
├── package.json           # NPM configuration file with dependencies and scripts
├── tsconfig.json          # TypeScript configuration file
└── README.md              # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd eventbrite-sydney-scraper
   ```

2. Install the dependencies:
   ```
   npm install
   ```

## Usage

To run the scraper, execute the following command:
```
npm run scrape
```

This will invoke the `scrapeEvents` function defined in `src/scraper.ts`, which fetches the HTML content from the Eventbrite Sydney events page and extracts relevant event data.

## Dependencies

- **axios**: For making HTTP requests to fetch the HTML content.
- **cheerio**: For parsing the HTML and extracting structured event data.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.