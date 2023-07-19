import { WebScraper } from "./scrapers/WebScraper";
export { WebScraper };

let scraper = new WebScraper();

async function main() {
  let name = process.argv[2];

  if (!name) {
    console.log(`Provide a name`);
    process.exit();
  }
  let stats = await scraper.gores.getPlayerStats(name);

  console.log(
    `${name}'s Gores Stats\n\nPoints: ${stats.totalPoints} (Fixed: ${stats.fixed
    } | Seasonal: ${stats.season})\nRank: ${stats.rank
    }\n\nFavourite Partners:\n${stats.topPartners
      .map((x) => `${x.name} (${x.finishes} finishes)`)
      .join("\n")}\n\n"Wasted" Time Spent On Maps: ${stats.wastedTime}`
  );
}

main();
