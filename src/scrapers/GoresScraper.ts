import axios from "axios";
import cheerio from "cheerio";
import puppeteer from "puppeteer";

export class GoresScraper {
  public basePlayerUrl = "https://kog.tw/#p=players&player=";

  // Can't fetch data like we do with ddnet,
  // Since kog.tw dynamically loads data with javascript after page load
  async getPlayerPage(playerName: string) {
    let url = `${this.basePlayerUrl}${playerName.split(" ").join("%20")}`;

    let browser = await puppeteer.launch({ headless: "new" });

    let page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle0" });

    let data = await page.content();

    await browser.close();

    return data;
  }

  async getPlayerStats(playerName: string, data?: any) {
    let $ = cheerio.load(data || (await this.getPlayerPage(playerName)));

    let content = $("div#content > div.container > div.row > div.col");

    let pointsCard = cheerio
      .load(content.html() as string)("div.card")
      .eq(0)
      .text();
    let otherCard = cheerio
      .load(content.html() as string)("div.card")
      .eq(1)
      .text();

    let [name, _, total_rank, fixed, season] = pointsCard
      .split("\n")
      .filter((x) => x.trim().length > 0);

    name = name.trim();

    let rankSplit = total_rank.split(".");
    let pointRank = rankSplit[0].trim();
    let totalPoints = rankSplit[1].split(" ")[2].trim();

    fixed = fixed.split(":")[1].trim();
    season = season.split(":")[1].trim();

    return {
      name,
      rank: pointRank,
      totalPoints,
      fixed,
      season,
    };
  }
}
