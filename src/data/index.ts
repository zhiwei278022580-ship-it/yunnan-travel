import type { Destination } from "./types";
import lijiang from "./destinations/lijiang";
import dali from "./destinations/dali";
import shangrila from "./destinations/shangrila";
import kunming from "./destinations/kunming";
import tengchong from "./destinations/tengchong";
import xishuangbanna from "./destinations/xishuangbanna";
import honghe from "./destinations/honghe";
import puer from "./destinations/puer";
import nujiang from "./destinations/nujiang";

const destinations: Destination[] = [
  lijiang,
  dali,
  shangrila,
  kunming,
  tengchong,
  xishuangbanna,
  honghe,
  puer,
  nujiang,
];

export default destinations;
export type { Destination, Attraction, AttractionType } from "./types";
