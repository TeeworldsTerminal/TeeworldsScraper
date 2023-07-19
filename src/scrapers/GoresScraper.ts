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
    let row = $("div#content > div.container > div.row");

    let content = cheerio.load(row.html() as string)("div.col");

    let pointsCard = cheerio
      .load(content.html() as string)("div.card")
      .eq(0)
      .text();

    // TODO: do this shit later
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

    let tabContent = cheerio.load(row.html() as string)(
      "div.col.col-sm-12 > div.tab-content"
    );

    let mapData = cheerio.load(tabContent.html() as string)("div#nav-maps");
    let generalData = cheerio.load(tabContent.html() as string)(
      "div#nav-general"
    );

    let cleaned = generalData
      .text()
      .split("\n")
      .map((x) => x.trim())
      .filter((x) => x.trim().length > 0);

    // Just remove useless text that isnt needed
    cleaned.splice(0, 1);
    cleaned.splice(cleaned.length - 1, 1);

    let topPartners: { finishes: number; name: string }[] = [];

    for (let i = 0; i < cleaned.length; i++) {
      let curr = cleaned[i];

      if (curr.startsWith("Wasted")) break;

      let split = curr.split(" ");

      topPartners.push({
        finishes: parseInt(split[0]),
        name: split.slice(1).join(" "),
      });
    }

    let wastedTime = cleaned[cleaned.length - 1];

    return {
      name,
      rank: pointRank,
      totalPoints,
      fixed,
      season,
      topPartners,
      wastedTime,
    };
  }
}
