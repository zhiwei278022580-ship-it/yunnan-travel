import { useParams, Link } from "react-router-dom";
import destinations from "../data/index";
import ImageWithFallback from "../components/ImageWithFallback";

const typeColors: Record<string, string> = {
  "国家级景区": "bg-blue-50 text-blue-700",
  "徒步路线": "bg-orange-50 text-orange-700",
  "野生秘境": "bg-emerald-50 text-emerald-700",
  "古镇村落": "bg-amber-50 text-amber-700",
  "湖泊雪山": "bg-cyan-50 text-cyan-700",
  "温泉湿地": "bg-teal-50 text-teal-700",
  "文化遗迹": "bg-purple-50 text-purple-700",
  "峡谷江河": "bg-indigo-50 text-indigo-700",
};

export default function AttractionDetail() {
  const { id } = useParams<{ id: string }>();
  let attraction = null;
  let parentDestination = null;

  for (const d of destinations) {
    const found = d.attractions.find((a) => a.id === id);
    if (found) {
      attraction = found;
      parentDestination = d;
      break;
    }
  }

  if (!attraction || !parentDestination) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">景点未找到</h2>
        <Link to="/" className="text-emerald-600 hover:underline">返回首页</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-400 mb-6">
        <Link to="/" className="hover:text-emerald-600 transition-colors">目的地</Link>
        <span className="mx-2">/</span>
        <Link to={`/destination/${parentDestination.id}`} className="hover:text-emerald-600 transition-colors">{parentDestination.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-600">{attraction.name}</span>
      </nav>

      {/* Image Gallery */}
      <div className="rounded-2xl overflow-hidden mb-8 grid grid-cols-2 gap-2">
        {attraction.images.map((img, i) => (
          <div key={i} className={`overflow-hidden ${i === 0 ? "col-span-2 aspect-[16/7]" : "aspect-[4/3]"}`}>
            <ImageWithFallback src={img} alt={`${attraction.name} ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Title */}
      <div className="mb-8">
        <span className={`text-sm px-3 py-1 rounded-full font-medium ${typeColors[attraction.type] || "bg-slate-50 text-slate-600"}`}>
          {attraction.type}
        </span>
        <h1 className="text-3xl font-extrabold text-slate-800 mt-3 mb-2">{attraction.name}</h1>
        <p className="text-lg text-emerald-700 font-medium">{attraction.oneLiner}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {attraction.tags.map((tag) => (
          <span key={tag} className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{tag}</span>
        ))}
      </div>

      {/* 为什么要去 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-3">为什么要去</h2>
        <p className="text-slate-600 leading-relaxed">{attraction.whyGo}</p>
      </section>

      {/* 核心看点 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-3">核心看点</h2>
        <ul className="space-y-3">
          {attraction.highlights.map((h, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
              <span className="text-emerald-500 font-bold mt-0.5 shrink-0">{i + 1}.</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 路线概览（徒步路线专用） */}
      {attraction.routeOverview && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-3">路线概览</h2>
          <div className="bg-slate-50 rounded-xl p-5">
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{attraction.routeOverview}</p>
          </div>
        </section>
      )}

      {/* 详细介绍 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-3">详细介绍</h2>
        <p className="text-slate-600 leading-relaxed">{attraction.description}</p>
      </section>

      {/* 准备清单（徒步/户外专用） */}
      {attraction.preparation && attraction.preparation.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-3">出发前准备</h2>
          <ul className="space-y-2">
            {attraction.preparation.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-600">
                <span className="text-emerald-500 shrink-0">&#10003;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 实操信息 */}
      <section className="bg-slate-50 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">实操信息</h2>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-slate-500 mb-1">怎么去</dt>
            <dd className="text-sm text-slate-700 leading-relaxed">{attraction.practical.howToGo}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500 mb-1">最佳季节</dt>
            <dd className="text-sm text-slate-700">{attraction.practical.bestSeason}</dd>
          </div>
          {attraction.practical.difficulty && (
            <div>
              <dt className="text-sm font-medium text-slate-500 mb-1">难度</dt>
              <dd className="text-sm text-slate-700">{attraction.practical.difficulty}</dd>
            </div>
          )}
          <div>
            <dt className="text-sm font-medium text-slate-500 mb-1">费用</dt>
            <dd className="text-sm text-slate-700">{attraction.practical.cost}</dd>
          </div>
          {attraction.practical.tips && (
            <div>
              <dt className="text-sm font-medium text-slate-500 mb-1">Tips</dt>
              <dd className="text-sm text-slate-700 leading-relaxed">{attraction.practical.tips}</dd>
            </div>
          )}
        </dl>
      </section>

      {/* Back */}
      <Link to={`/destination/${parentDestination.id}`} className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors">
        &larr; 返回{parentDestination.name}的所有景点
      </Link>
    </div>
  );
}
