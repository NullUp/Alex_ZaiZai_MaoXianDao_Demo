import type { CollectibleItem, ProjectItem } from '@/types/game'

export const projects: ProjectItem[] = [
  {
    id: 'crossy-road',
    title: '过马路',
    category: '小游戏',
    description: '要不要进入一个 Crossy Road 风格的挑战？控制小男孩穿过车流，跳上木桩，跨越河水。',
    highlights: ['小男孩主角', '躲避汽车', '跨越河流'],
    url: '/crossy-road',
    position: [0, 0, -5],
    color: '#facc15',
    action: 'crossy-road',
    displayModel: 'chicken',
  },
  {
    id: 'portfolio',
    title: '星光作品集',
    category: '互动展示',
    description: '把个人经历拆成可探索的岛屿，用 3D 展台承载项目、技能和故事。',
    highlights: ['第三人称探索', '作品弹窗', '低多边形玩具世界'],
    url: 'https://example.com/portfolio',
    position: [-14, 0, -10],
    color: '#f97316',
  },
  {
    id: 'lab',
    title: '创意实验室',
    category: 'Three.js Demo',
    description: '收纳粒子、着色器、交互物理和小游戏原型的实验空间。',
    highlights: ['漂浮实验台', '动效展示', '轻量后处理'],
    url: 'https://example.com/lab',
    position: [12, 0, -14],
    color: '#2563eb',
  },
  {
    id: 'story',
    title: '冒险履历馆',
    category: '叙事简历',
    description: '用路线、路标和纪念徽章讲述成长经历，让浏览变成一次小冒险。',
    highlights: ['章节式动线', '成就徽章', '沉浸式信息卡'],
    url: 'https://example.com/story',
    position: [-4.8, 0, -2.6],
    color: '#16a34a',
  },
]

export const collectibles: CollectibleItem[] = [
  { id: 'star-1', position: [-8, 1.2, -2] },
  { id: 'star-2', position: [4, 1.2, -12] },
  { id: 'star-3', position: [14, 1.2, 2] },
  { id: 'star-4', position: [-16, 1.2, 10] },
  { id: 'star-5', position: [0, 2.2, 14] },
]
