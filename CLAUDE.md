# 云南旅行 App - Claude Code 会话上下文

## 项目概述
React 19 + Vite 8 + TypeScript + Tailwind CSS v4 + React Router v7 的云南旅行应用，托管在 GitHub Pages。

## 最新部署
https://zhiwei278022580-ship-it.github.io/yunnan-travel/

## 技术栈
- 框架: React 19 + Vite 8 + TypeScript
- 样式: Tailwind CSS v4
- 路由: React Router v7 (HashRouter for GitHub Pages)
- 地图: 自定义 SVG（无 d3-geo），使用 DataV.GeoAtlas GeoJSON

## 关键数据文件
- `src/data/index.ts` — 目的地和景点数据
- `src/data/yunnanGeo.ts` — GeoJSON 生成的 16 个地州 SVG 路径，800×600 viewBox
- `scripts/build-yunnan-geo.mjs` — GeoJSON → SVG 路径的构建脚本

## 用户偏好（来自对话）
- 喜欢真实地理轮廓的地图，不喜欢简化示意图
- 不喜欢卡片堆叠，想要地图为中心的展示
- 不喜欢拥挤、杂乱的标签布局
- 地图要有美感、简洁、现代感

## 当前 DestinationHubMap 状态
已实现的版本特点：
- 只显示当前地州的真实边界（而非全部 16 个地州）
- 景点用圆点标记，距离 km 数字徽章在点上方
- 标签用 pill 形状，左右或上下放置（带碰撞检测）
- 去掉了蜘蛛网连线，视觉更清爽
- 右下角有云南缩略图显示当前位置
- 中心枢纽带发光效果

## 待优化
- DestinationHubMap 的美学仍需改进（用户参考了某张图片但图片未能正确读取）
- 用户想要的风格：待描述（图片读取有问题）

## ADCODE → 目的地映射
```
kunming: 530100, tengchong: 530500, lijiang: 530700,
puer: 530800, honghe: 532500, xishuangbanna: 532800,
dali: 532900, nujiang: 533300, shangrila: 533400
```

## Git 操作
- main 分支: 开发代码
- gh-pages 分支: 部署产物（自动通过 gh-pages npm 包发布）
- 构建命令: `npx vite build`
- 部署命令: `npx gh-pages -d dist`
