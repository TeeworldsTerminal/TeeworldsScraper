import { WebScraper } from "./scrapers/WebScraper";
export { WebScraper };

let scraper = new WebScraper();

async function main() {
  await scraper.gores.getPlayerStats("Wocket Woo");
}

main();
