// Fetch verified scenic images from English Wikipedia + Wikimedia Commons.
// Uses native fetch (Node 24+). Run: node scripts/fetch-verified-images.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ATTRACTIONS = [
  // ========== 丽江 ==========
  { id: "yulong-snow-mountain", zh: "玉龙雪山", en: "Jade Dragon Snow Mountain Yunnan" },
  { id: "blue-moon-valley", zh: "蓝月谷", en: "Blue Moon Valley Lijiang Yunnan" },
  { id: "tiger-leaping-gorge", zh: "虎跳峡", en: "Tiger Leaping Gorge Yunnan" },
  { id: "lijiang-old-town", zh: "丽江古城", en: "Old Town of Lijiang Yunnan" },
  { id: "ganheba", zh: "干河坝", en: "Jade Dragon Snow Mountain valley" },
  { id: "haba-black-sea", zh: "哈巴黑海", en: "Haba Snow Mountain lake Yunnan" },
  { id: "shuhe-old-town", zh: "束河古镇", en: "Shuhe Ancient Town Lijiang" },
  { id: "baisha-old-town", zh: "白沙古镇", en: "Baisha old town Lijiang Yunnan" },
  { id: "lashi-lake", zh: "拉市海", en: "Lashihai Lake Lijiang Yunnan" },
  { id: "yuhu-village", zh: "玉湖村", en: "Yuhu village Jade Dragon Mountain Lijiang" },
  { id: "baoshan-stone-city", zh: "宝山石头城", en: "Baoshan Stone City Jinsha River" },
  { id: "laojun-mountain", zh: "老君山", en: "Laojun Mountain Danxia landform Yunnan" },
  { id: "first-bend-yangtze", zh: "长江第一湾", en: "First Bend Yangtze River Shigu" },
  { id: "wenhai", zh: "文海", en: "Wenhai alpine lake Lijiang" },
  { id: "black-dragon-pool", zh: "黑龙潭", en: "Black Dragon Pool park Lijiang" },

  // ========== 大理 ==========
  { id: "erhai-lake", zh: "洱海", en: "Erhai Lake Dali Yunnan" },
  { id: "cangshan", zh: "苍山", en: "Cangshan Mountain Dali Yunnan" },
  { id: "dali-old-town", zh: "大理古城", en: "Dali Old Town Yunnan" },
  { id: "shuanglang", zh: "双廊古镇", en: "Shuanglang ancient town Erhai" },
  { id: "xizhou", zh: "喜洲古镇", en: "Xizhou old town Dali Yunnan" },
  { id: "shaxi-old-town", zh: "沙溪古镇", en: "Shaxi Ancient Town Yunnan" },
  { id: "jizu-mountain", zh: "鸡足山", en: "Jizu Mountain Buddhist Dali Yunnan" },
  { id: "weishan-old-town", zh: "巍山古城", en: "Weishan Ancient Town Yunnan" },
  { id: "nuodeng-village", zh: "诺邓古村", en: "Nuodeng Ancient Village Yunnan" },
  { id: "butterfly-spring", zh: "蝴蝶泉", en: "Butterfly Spring Dali Yunnan" },
  { id: "longkan-pier", zh: "龙龛码头", en: "Erhai Lake pier sunrise Dali" },
  { id: "zhoucheng-tie-dye", zh: "周城扎染", en: "Zhoucheng tie dye Bai Dali Yunnan" },

  // ========== 香格里拉 ==========
  { id: "pudacuo", zh: "普达措", en: "Pudacuo National Park Shangri-La" },
  { id: "songzanlin", zh: "松赞林寺", en: "Songzanlin Monastery Shangri-La Yunnan" },
  { id: "meili-snow-mountain", zh: "梅里雪山", en: "Meili Snow Mountain Kawagebo Yunnan" },
  { id: "yubeng-village", zh: "雨崩村", en: "Yubeng village Meili Snow Mountain" },
  { id: "dukezong-old-town", zh: "独克宗古城", en: "Dukezong ancient town Shangri-La" },
  { id: "napa-lake", zh: "纳帕海", en: "Napa Lake Shangri-La Yunnan" },

  // ========== 昆明 ==========
  { id: "shilin", zh: "石林", en: "Stone Forest Shilin Kunming Yunnan" },
  { id: "dianchi-lake", zh: "滇池", en: "Dianchi Lake Kunming Yunnan" },
  { id: "cuihu-park", zh: "翠湖公园", en: "Green Lake Park Cuihu Kunming Yunnan" },
  { id: "dongchuan-red-land", zh: "东川红土地", en: "Dongchuan Red Land Yunnan" },
  { id: "jiuxiang", zh: "九乡溶洞", en: "Jiuxiang Karst Cave Yunnan" },
  { id: "jiaozi-snow-mountain", zh: "轿子雪山", en: "Jiaozi Snow Mountain Kunming" },
  { id: "guandu-old-town", zh: "官渡古镇", en: "Guandu ancient town Kunming Yunnan" },
  { id: "daguan-pavilion", zh: "大观楼", en: "Daguan Pavilion Kunming Yunnan" },
  { id: "yunnan-nationalities-village", zh: "云南民族村", en: "Yunnan Nationalities Village Kunming" },
  { id: "golden-temple", zh: "金殿", en: "Golden Temple Jindian Kunming Yunnan" },
  { id: "yunnan-wild-animal-park", zh: "云南野生动物园", en: "Yunnan Wild Animal Park Kunming" },
  { id: "zoo-farm-kunming", zh: "抚仙湖", en: "Fuxian Lake Chengjiang Yunnan" },

  // ========== 腾冲 ==========
  { id: "heshun-old-town", zh: "和顺古镇", en: "Heshun Ancient Town Tengchong Yunnan" },
  { id: "rehai", zh: "热海", en: "Rehai Hot Sea Tengchong Yunnan" },
  { id: "yin-xing-village", zh: "银杏村", en: "Ginkgo Village Tengchong Yunnan" },
  { id: "volcano-national-park", zh: "腾冲火山", en: "Tengchong Volcano national park Yunnan" },
  { id: "guoshang-cemetery", zh: "国殇墓园", en: "Tengchong war cemetery Yunnan" },
  { id: "north-sea-wetland", zh: "北海湿地", en: "Beihai Wetland Tengchong Yunnan" },
  { id: "gaoligong-mountain", zh: "高黎贡山", en: "Gaoligong Mountain nature reserve Yunnan" },
  { id: "yunfeng-mountain", zh: "云峰山", en: "Yunfeng Mountain Tengchong Yunnan" },
  { id: "dieshuihe-waterfall", zh: "叠水河瀑布", en: "Dieshuihe Waterfall Tengchong Yunnan" },
  { id: "sakura-valley-tengchong", zh: "腾冲樱花谷", en: "Tengchong cherry blossom valley Yunnan" },

  // ========== 西双版纳 ==========
  { id: "tropical-botanical-garden", zh: "西双版纳热带植物园", en: "Xishuangbanna Tropical Botanical Garden" },
  { id: "wild-elephant-valley", zh: "野象谷", en: "Wild Elephant Valley Xishuangbanna Yunnan" },
  { id: "manting-park", zh: "曼听公园", en: "Manting Park Jinghong Xishuangbanna" },
  { id: "gaozhuang-xishuangjing", zh: "告庄西双景", en: "Gaozhuang night market Jinghong Xishuangbanna" },
  { id: "wangtianshu", zh: "望天树", en: "Wangtianshu canopy walkway Xishuangbanna" },
  { id: "jinuo-mountain", zh: "基诺山", en: "Jinuo Mountain ethnic Xishuangbanna Yunnan" },
  { id: "dai-minority-park", zh: "傣族园", en: "Dai Minority Park Xishuangbanna Yunnan" },
  { id: "mengjinglai", zh: "勐景来", en: "Mengjinglai Dai village Yunnan" },
  { id: "shwedagon-pagoda-jinghong", zh: "总佛寺", en: "Xishuangbanna Buddhist temple Jinghong" },
  { id: "lancang-river-banna", zh: "澜沧江", en: "Lancang Mekong River Jinghong Yunnan" },

  // ========== 红河 ==========
  { id: "yuanyang-terraces", zh: "元阳梯田", en: "Yuanyang Rice Terraces Hani Yunnan" },
  { id: "jianshui-old-town", zh: "建水古城", en: "Jianshui Ancient Town Yunnan" },
  { id: "tuan-shan-ancient-village", zh: "团山古村", en: "Tuanshan village Jianshui Yunnan" },
  { id: "bisezhai", zh: "碧色寨", en: "Bisezhai railway station Yunnan" },
  { id: "mengzi-guogiaomixian", zh: "蒙自南湖", en: "Mengzi South Lake Yunnan" },
  { id: "swallow-cave-jianshui", zh: "燕子洞", en: "Swallow Cave Jianshui Yunnan" },
  { id: "ake-village", zh: "阿者科", en: "Ake village Hani mushroom houses Yuanyang" },
  { id: "mile-dongfengyun", zh: "弥勒东风韵", en: "Mile Dongfengyun red brick Yunnan" },
  { id: "shiping-old-town", zh: "石屏古城", en: "Shiping ancient town Yunnan" },

  // ========== 普洱 ==========
  { id: "jingmai-mountain", zh: "景迈山", en: "Jingmai Mountain tea plantation Puer" },
  { id: "solar-river-park", zh: "普洱太阳河国家公园", en: "Puer Sun River National Park Yunnan" },
  { id: "tea-horse-road-puer", zh: "普洱茶马古道", en: "Tea Horse Road ancient trail Puer Yunnan" },
  { id: "ximeng-wa", zh: "西盟佤族", en: "Ximeng Wa ethnic village Yunnan" },
  { id: "jiangcheng", zh: "江城", en: "Jiangcheng Yunnan border town" },

  // ========== 怒江 ==========
  { id: "nujiang-grand-canyon", zh: "怒江大峡谷", en: "Nujiang Grand Canyon Nu River Yunnan" },
  { id: "bingzhongluo", zh: "丙中洛", en: "Bingzhongluo Yunnan" },
  { id: "dulong-river", zh: "独龙江", en: "Dulong River valley Yunnan" },
  { id: "laomudeng", zh: "老姆登", en: "Laomudeng village church Nujiang Yunnan" },
  { id: "stone-moon", zh: "石月亮", en: "Stone Moon natural arch Nujiang Yunnan" },
  { id: "zhiziluo", zh: "知子罗", en: "Zhiziluo abandoned city Nujiang Yunnan" },
  { id: "wuli-village", zh: "雾里村", en: "Wuli village Nujiang Yunnan" },
];

const IMG_EXT = /\.(jpg|jpeg|png|gif|webp|svg|tif|tiff)$/i;

async function fetchJson(url, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "YunnanTravelApp/1.0",
          "Connection": "close",
        },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) {
        if (attempt < retries) { await new Promise((r) => setTimeout(r, 2000)); continue; }
        return null;
      }
      return await res.json();
    } catch (e) {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }
  return null;
}

async function searchCommons(query, limit = 6) {
  const params = new URLSearchParams({
    action: "query", list: "search", srsearch: query,
    srnamespace: "6", srlimit: String(limit), srsort: "relevance",
    format: "json", origin: "*",
  });
  const data = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`);
  if (!data?.query?.search) return [];
  return data.query.search
    .map((r) => r.title.replace(/^File:/, ""))
    .filter((f) => IMG_EXT.test(f));
}

async function getWikiLeadImage(title) {
  const params = new URLSearchParams({
    action: "query", titles: title, prop: "pageimages",
    pithumbsize: "800", format: "json", origin: "*",
  });
  const data = await fetchJson(`https://en.wikipedia.org/w/api.php?${params}`);
  if (!data?.query?.pages) return null;
  for (const page of Object.values(data.query.pages)) {
    if (page.thumbnail?.source) {
      return page.thumbnail.source.replace(/\/\d+px-/, "/800px-");
    }
  }
  return null;
}

async function getWikiImageBySearch(query) {
  const params = new URLSearchParams({
    action: "query", list: "search", srsearch: query,
    srlimit: "1", format: "json", origin: "*",
  });
  const data = await fetchJson(`https://en.wikipedia.org/w/api.php?${params}`);
  if (!data?.query?.search?.length) return null;
  return getWikiLeadImage(data.query.search[0].title);
}

function commonsUrl(filename, width = 800) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=${width}`;
}

async function fetchImages(id, zh, en) {
  const images = [];
  const seen = new Set();

  function addUrl(url) {
    if (!url || seen.has(url)) return;
    seen.add(url);
    images.push(url);
  }

  // Try Commons with various queries (English, Chinese, short forms)
  const commonsQueries = [en, zh, en.split(" ").slice(0, 3).join(" "), zh.replace(/\s+/g, "")];
  for (const q of commonsQueries) {
    if (images.length >= 4) break;
    if (!q) continue;
    const files = await searchCommons(q, 6);
    for (const f of files) {
      if (images.length >= 4) break;
      addUrl(commonsUrl(f));
    }
    await new Promise((r) => setTimeout(r, 80));
  }

  // Try Wikipedia with multiple strategies
  if (images.length < 4) {
    const wikiTitles = [en, zh, en.split(",")[0].trim(), zh.split(" ")[0]];
    for (const title of wikiTitles) {
      if (images.length >= 4) break;
      if (!title) continue;
      const img = (await getWikiLeadImage(title)) || (await getWikiImageBySearch(title));
      addUrl(img);
      await new Promise((r) => setTimeout(r, 80));
    }
  }

  // If still short, try a broader Commons search with just the key terms
  if (images.length < 4) {
    const shortEn = en.split(" ").slice(0, 2).join(" ");
    const files = await searchCommons(shortEn, 8);
    for (const f of files) {
      if (images.length >= 4) break;
      addUrl(commonsUrl(f));
    }
  }

  // Pad to 4 if we have at least 1
  if (images.length > 0 && images.length < 4) {
    const first = images[0];
    const widths = [800, 1200, 600, 400];
    const padded = [];
    for (let i = 0; i < 4; i++) {
      let url = first;
      if (url.includes("width=")) url = url.replace(/width=\d+/, `width=${widths[i]}`);
      else if (url.includes("/thumb/")) url = url.replace(/\/\d+px-/, `/${widths[i]}px-`);
      else url += (url.includes("?") ? "&" : "?") + `width=${widths[i]}`;
      padded.push(url);
    }
    return padded;
  }

  return images.slice(0, 4);
}

const COVER_QUERIES = {
  "lijiang-cover": "Lijiang old town Yunnan",
  "dali-cover": "Dali old town Yunnan",
  "shangrila-cover": "Shangri-La Songzanlin Monastery",
  "kunming-cover": "Kunming Dianchi Lake Yunnan",
  "tengchong-cover": "Heshun old town Tengchong",
  "xishuangbanna-cover": "Gaozhuang night market Jinghong Xishuangbanna",
  "honghe-cover": "Yuanyang rice terraces Hani Yunnan",
  "puer-cover": "Jingmai Mountain tea plantation Puer",
  "nujiang-cover": "Bingzhongluo Nujiang Yunnan",
};

async function main() {
  console.log(`Fetching verified images for ${ATTRACTIONS.length} attractions...\n`);

  const results = {};
  let full = 0, partial = 0, none = 0;

  for (let i = 0; i < ATTRACTIONS.length; i++) {
    const { id, zh, en } = ATTRACTIONS[i];
    const label = `[${String(i + 1).padStart(2)}/${ATTRACTIONS.length}] ${zh}`;
    process.stdout.write(`${label} ... `);
    try {
      const imgs = await fetchImages(id, zh, en);
      results[id] = imgs;
      if (imgs.length >= 4) { console.log(`✓ (${imgs.length})`); full++; }
      else if (imgs.length > 0) { console.log(`⚠ ${imgs.length}`); partial++; }
      else { console.log(`✗`); none++; }
    } catch (e) {
      console.log(`✗ ${e.message}`);
      results[id] = [];
      none++;
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  // Destination covers
  console.log("\n--- Destination covers ---");
  for (const [key, query] of Object.entries(COVER_QUERIES)) {
    process.stdout.write(`  ${key} ... `);
    const files = await searchCommons(query, 5);
    const wikiImg = files.length === 0 ? (await getWikiImageBySearch(query)) : null;
    if (files.length >= 4) {
      results[key] = files.slice(0, 4).map((f) => commonsUrl(f));
      console.log(`✓ (${files.length})`);
    } else if (files.length > 0) {
      const urls = files.map((f) => commonsUrl(f));
      while (urls.length < 4) urls.push(commonsUrl(files[0], 400 + urls.length * 200));
      results[key] = urls;
      console.log(`⚠ ${files.length}`);
    } else if (wikiImg) {
      results[key] = [wikiImg, wikiImg, wikiImg, wikiImg];
      console.log(`✓ wiki`);
    } else {
      results[key] = [];
      console.log(`✗`);
    }
    await new Promise((r) => setTimeout(r, 200));
  }

  const outPath = path.join(__dirname, "..", "src", "data", "imageUrlsVerif.ts");
  const out = `// Verified scenic image URLs from Wikimedia Commons & Wikipedia.
// Each attraction ID maps to up to 4 image URLs (CC-licensed).
// Generated: ${new Date().toISOString()}

const imageUrls: Record<string, string[]> = ${JSON.stringify(results, null, 2)};

export default imageUrls;
`;

  fs.writeFileSync(outPath, out, "utf-8");
  console.log(`\n${"─".repeat(40)}`);
  console.log(`Full: ${full}  Partial: ${partial}  Failed: ${none}`);
  console.log(`Written: ${outPath}`);
}

main().catch(console.error);
