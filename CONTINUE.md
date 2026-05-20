# 继续工作指南

## 当前状态

项目已在 GitHub: https://github.com/zhiwei278022580-ship-it/yunnan-travel
部署地址: https://zhiwei278022580-ship-it.github.io/yunnan-travel/

### 本次会话做了什么
1. 用真实的 DataV.GeoAtlas GeoJSON 替换了手绘简化地图 → 16 个地州真实轮廓
2. 重新设计了 DestinationHubMap（丽江等目的地页面里的地图组件）
3. 优化了 YunnanSVGMap（首页的全省地图）
4. 美化了 Layout、Home、DestinationCard、AttractionCard 等多个组件

### 待完成的核心任务

**DestinationHubMap 美学改进** — 用户对当前版本不满意，参考了一张图片但图片在 Windows 上无法读取。

**请在 Mac 上重新上传这张参考图**：
https://minimax-algeng-chat-tts.oss-cn-wulanchabu.aliyuncs.com/ccv2%2F2026-05-20%2FMiniMax-M2.7%2F2056698948533359410%2F686e6df3a157a939ded4f551eb6c1b9bf3e6db4b7c527f86f8afaf4cffa4d02f..jpeg?Expires=1779333742&OSSAccessKeyId=LTAI5tGLnRTkBjLuYPjNcKQ8&Signature=rLimn3EEleYQ8CYxkli4oIHifeE%3D

上传后描述图片中地图的：背景风格、标记形状、标签样式、连线样式、整体配色

## 快速开始（Mac 上）

```bash
# 1. 克隆项目
git clone https://github.com/zhiwei278022580-ship-it/yunnan-travel.git
cd yunnan-travel

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npx vite --host 0.0.0.0 --port 5173

# 4. 构建并部署
npx vite build
npx gh-pages -d dist
```

## 技术要点

### DestinationHubMap（需要改进的文件）
- 路径: `src/components/DestinationHubMap.tsx`
- 使用 `src/data/yunnanGeo.ts` 中的真实地州 SVG 轮廓
- 坐标转换: 全局 800×600 SVG → 本地投影坐标
- 当前实现: 只显示当前地州边界，景点圆点+km徽章，pill 标签，智能碰撞检测，无蜘蛛网连线，右下角缩略图

### YunnanSVGMap（首页全省地图）
- 路径: `src/components/YunnanSVGMap.tsx`
- 16 个地州全部显示，活跃地州有彩色渐变
- 悬停显示侧边栏信息卡

### yunnanGeo.ts（地理数据）
- 路径: `src/data/yunnanGeo.ts`（自动生成，219 行，~148KB）
- 通过 `scripts/build-yunnan-geo.mjs` 从 GeoJSON 生成
- VIEWBOX_W=800, VIEWBOX_H=600
- 16 个地州 features，每个有 adcode、name、destinationId、icon、palette、path、labelX、labelY

### 坐标变换算法（重要）
```typescript
// 全局 SVG → 经纬度
const GLOBAL = { minLon: 97.529, maxLon: 106.192, minLat: 21.142, maxLat: 29.223 };
const gMidLat = (GLOBAL.minLat + GLOBAL.maxLat) / 2;
const gCos = Math.cos((gMidLat * Math.PI) / 180);
const gs = Math.min(VIEWBOX_W / ((GLOBAL.maxLon - GLOBAL.minLon) * gCos), VIEWBOX_H / (GLOBAL.maxLat - GLOBAL.minLat));
const gOffX = (VIEWBOX_W - (GLOBAL.maxLon - GLOBAL.minLon) * gCos * gs) / 2;
const gOffY = (VIEWBOX_H - (GLOBAL.maxLat - GLOBAL.minLat) * gs) / 2;

// 全局坐标 → 经纬度 → 本地投影
const transformPath = (globalPath: string): string => {
  return globalPath.replace(/([0-9.]+),([0-9.]+)/g, (_: string, gx: string, gy: string) => {
    const lon = (parseFloat(gx) - gOffX) / (gCos * gs) + GLOBAL.minLon;
    const lat = GLOBAL.maxLat - (parseFloat(gy) - gOffY) / gs;
    const p = projectCoord(lon, lat);
    return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
  });
};
```

## ADCODE 映射
```typescript
const DEST_TO_ADCODE = {
  kunming: "530100", tengchong: "530500", lijiang: "530700",
  puer: "530800", honghe: "532500", xishuangbanna: "532800",
  dali: "532900", nujiang: "533300", shangrila: "533400",
};
```

## 用户偏好（来自历史对话）
- 喜欢真实地理轮廓的地图
- 不喜欢卡片堆叠，想要地图为中心的展示
- 不喜欢拥挤杂乱的标签
- 地图要有美感、简洁、现代感
