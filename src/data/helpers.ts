import type { Attraction, AttractionType } from "./types";
import imageUrls from "./imageUrlsVerif";

export const img = (id: string, n: number) => {
  const urls = imageUrls[id];
  if (urls && urls[n - 1]) return urls[n - 1];
  return urls?.[0] || "";
};

interface Raw {
  id: string; name: string; type: AttractionType; coords: [number, number]; tags: string[];
  one: string; why: string; desc: string; hl: string[];
  go: string; season: string; diff?: string; cost: string; tips?: string;
  prep?: string[]; route?: string;
}

export function a(r: Raw): Attraction {
  return {
    id: r.id, name: r.name, type: r.type, coords: r.coords, tags: r.tags,
    oneLiner: r.one, whyGo: r.why, description: r.desc, highlights: r.hl,
    practical: { howToGo: r.go, bestSeason: r.season, difficulty: r.diff, cost: r.cost, tips: r.tips },
    images: [img(r.id,1), img(r.id,2), img(r.id,3), img(r.id,4)],
    preparation: r.prep, routeOverview: r.route,
  };
}
