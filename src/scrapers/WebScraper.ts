import { GoresScraper } from "./GoresScraper";
import { RaceScraper } from "./RaceScraper";

export interface WebScraper {
  gores: GoresScraper;
  race: RaceScraper;
}

export class WebScraper {
  constructor() {
    this.gores = new GoresScraper();
    this.race = new RaceScraper();
  }
}
