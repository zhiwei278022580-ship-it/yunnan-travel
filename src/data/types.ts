export type AttractionType =
  | "国家级景区" | "徒步路线" | "野生秘境" | "古镇村落"
  | "湖泊雪山" | "温泉湿地" | "文化遗迹" | "峡谷江河" | "观景台";

export interface Attraction {
  id: string; name: string; type: AttractionType;
  coords: [number, number]; tags: string[];
  oneLiner: string; whyGo: string; description: string;
  highlights: string[]; routeOverview?: string; preparation?: string[];
  practical: { howToGo: string; bestSeason: string; difficulty?: string; cost: string; tips?: string };
  images: string[];
}

export interface Destination {
  id: string; name: string; region: string; coords: [number, number];
  description: string; coverImage: string; attractions: Attraction[];
}
