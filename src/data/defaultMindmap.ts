import { MindmapNode, MindmapEdge, getNodeColor } from '../types';

// Create a node with proper styling
const createNode = (
  id: string,
  label: string,
  level: number,
  position: { x: number; y: number }
): MindmapNode => ({
  id,
  type: 'mindmapNode',
  position,
  data: {
    label,
    level,
    color: getNodeColor(level),
  },
});

// Create an edge between two nodes
const createEdge = (source: string, target: string): MindmapEdge => ({
  id: `e-${source}-${target}`,
  source,
  target,
  type: 'smoothstep',
  animated: false,
  style: { stroke: '#64748b', strokeWidth: 2 },
});

// Default mind map nodes for 用户意愿挖掘与营销策略
export const defaultNodes: MindmapNode[] = [
  // Root node
  createNode('root', '用户意愿挖掘与营销策略', 0, { x: 600, y: 50 }),

  // Level 1 main branches
  createNode('1-1', '核心分析法', 1, { x: 100, y: 180 }),
  createNode('1-2', '转化漏斗数据', 1, { x: 350, y: 180 }),
  createNode('1-3', '意愿判断维度', 1, { x: 600, y: 180 }),
  createNode('1-4', '营销全流程', 1, { x: 850, y: 180 }),
  createNode('1-5', '客户画像与分层', 1, { x: 1100, y: 180 }),
  createNode('1-6', '触达时间轴细节', 1, { x: 1350, y: 180 }),
  createNode('1-7', '业务场景', 1, { x: 1550, y: 180 }),

  // Level 2 - 核心分析法
  createNode('2-1-1', '5W2H分析框架', 2, { x: 30, y: 300 }),
  createNode('2-1-2', '核心问题：是什么？（定义意愿）', 2, { x: 30, y: 370 }),

  // Level 2 - 转化漏斗数据
  createNode('2-2-1', '30% (初步接触)', 2, { x: 280, y: 300 }),
  createNode('2-2-2', '10-15% (意向筛选)', 2, { x: 280, y: 370 }),
  createNode('2-2-3', '5-10% (最终转化)', 2, { x: 280, y: 440 }),

  // Level 2 - 意愿判断维度
  createNode('2-3-1', '行业范围', 2, { x: 530, y: 300 }),
  createNode('2-3-2', '常规表现指标', 2, { x: 530, y: 370 }),
  createNode('2-3-3', '关键要素', 2, { x: 530, y: 440 }),

  // Level 3 - 行业范围子节点
  createNode('3-3-1-1', '全行业', 3, { x: 450, y: 520 }),
  createNode('3-3-1-2', '多行业', 3, { x: 530, y: 520 }),
  createNode('3-3-1-3', '单行业', 3, { x: 610, y: 520 }),

  // Level 3 - 常规表现指标子节点
  createNode('3-3-2-1', '客户意图', 3, { x: 420, y: 600 }),
  createNode('3-3-2-2', '决策周期', 3, { x: 500, y: 600 }),
  createNode('3-3-2-3', '投放频率', 3, { x: 580, y: 600 }),
  createNode('3-3-2-4', '投放策略', 3, { x: 660, y: 600 }),

  // Level 3 - 关键要素子节点
  createNode('3-3-3-1', '时机', 3, { x: 450, y: 680 }),
  createNode('3-3-3-2', '运营策略', 3, { x: 530, y: 680 }),
  createNode('3-3-3-3', '产品配合', 3, { x: 620, y: 680 }),

  // Level 2 - 营销全流程
  createNode('2-4-1', '数据流转', 2, { x: 780, y: 300 }),
  createNode('2-4-2', '规则与风控', 2, { x: 780, y: 370 }),

  // Level 3 - 数据流转子节点
  createNode('3-4-1-1', '基础数据', 3, { x: 750, y: 450 }),
  createNode('3-4-1-2', '营销记录', 3, { x: 750, y: 510 }),
  createNode('3-4-1-3', '营销结果', 3, { x: 750, y: 570 }),
  createNode('3-4-1-4', '单据字段录入', 3, { x: 750, y: 630 }),

  // Level 3 - 规则与风控子节点
  createNode('3-4-2-1', '官方规则限制', 3, { x: 870, y: 450 }),
  createNode('3-4-2-2', '效果监测', 3, { x: 870, y: 510 }),

  // Level 2 - 客户画像与分层
  createNode('2-5-1', '客户分级', 2, { x: 1030, y: 300 }),
  createNode('2-5-2', '人的特征分析', 2, { x: 1030, y: 370 }),
  createNode('2-5-3', '高价值信号', 2, { x: 1030, y: 440 }),
  createNode('2-5-4', '负向指标', 2, { x: 1030, y: 510 }),

  // Level 3 - 客户分级子节点
  createNode('3-5-1-1', 'A类', 3, { x: 1000, y: 580 }),
  createNode('3-5-1-2', 'B类', 3, { x: 1060, y: 580 }),
  createNode('3-5-1-3', 'P类', 3, { x: 1120, y: 580 }),

  // Level 3 - 人的特征分析子节点
  createNode('3-5-2-1', '性格特质', 3, { x: 1000, y: 650 }),
  createNode('3-5-2-2', '行为反馈', 3, { x: 1080, y: 650 }),
  createNode('3-5-2-3', '反应速度', 3, { x: 1160, y: 650 }),

  // Level 3 - 高价值信号子节点
  createNode('3-5-3-1', '高净值', 3, { x: 1000, y: 720 }),
  createNode('3-5-3-2', '高意向被触达', 3, { x: 1100, y: 720 }),

  // Level 3 - 负向指标子节点
  createNode('3-5-4-1', '投诉', 3, { x: 1030, y: 790 }),

  // Level 2 - 触达时间轴细节
  createNode('2-6-1', '发送时间', 2, { x: 1280, y: 300 }),
  createNode('2-6-2', '到达时间', 2, { x: 1280, y: 370 }),
  createNode('2-6-3', '点击时间', 2, { x: 1280, y: 440 }),
  createNode('2-6-4', '总时长/频次', 2, { x: 1280, y: 510 }),

  // Level 2 - 业务场景
  createNode('2-7-1', '进、销、存 (B2B/SaaS软件)', 2, { x: 1480, y: 300 }),
];

// Default mind map edges
export const defaultEdges: MindmapEdge[] = [
  // Root to Level 1
  createEdge('root', '1-1'),
  createEdge('root', '1-2'),
  createEdge('root', '1-3'),
  createEdge('root', '1-4'),
  createEdge('root', '1-5'),
  createEdge('root', '1-6'),
  createEdge('root', '1-7'),

  // Level 1 to Level 2 - 核心分析法
  createEdge('1-1', '2-1-1'),
  createEdge('1-1', '2-1-2'),

  // Level 1 to Level 2 - 转化漏斗数据
  createEdge('1-2', '2-2-1'),
  createEdge('1-2', '2-2-2'),
  createEdge('1-2', '2-2-3'),

  // Level 1 to Level 2 - 意愿判断维度
  createEdge('1-3', '2-3-1'),
  createEdge('1-3', '2-3-2'),
  createEdge('1-3', '2-3-3'),

  // Level 2 to Level 3 - 行业范围
  createEdge('2-3-1', '3-3-1-1'),
  createEdge('2-3-1', '3-3-1-2'),
  createEdge('2-3-1', '3-3-1-3'),

  // Level 2 to Level 3 - 常规表现指标
  createEdge('2-3-2', '3-3-2-1'),
  createEdge('2-3-2', '3-3-2-2'),
  createEdge('2-3-2', '3-3-2-3'),
  createEdge('2-3-2', '3-3-2-4'),

  // Level 2 to Level 3 - 关键要素
  createEdge('2-3-3', '3-3-3-1'),
  createEdge('2-3-3', '3-3-3-2'),
  createEdge('2-3-3', '3-3-3-3'),

  // Level 1 to Level 2 - 营销全流程
  createEdge('1-4', '2-4-1'),
  createEdge('1-4', '2-4-2'),

  // Level 2 to Level 3 - 数据流转
  createEdge('2-4-1', '3-4-1-1'),
  createEdge('2-4-1', '3-4-1-2'),
  createEdge('2-4-1', '3-4-1-3'),
  createEdge('2-4-1', '3-4-1-4'),

  // Level 2 to Level 3 - 规则与风控
  createEdge('2-4-2', '3-4-2-1'),
  createEdge('2-4-2', '3-4-2-2'),

  // Level 1 to Level 2 - 客户画像与分层
  createEdge('1-5', '2-5-1'),
  createEdge('1-5', '2-5-2'),
  createEdge('1-5', '2-5-3'),
  createEdge('1-5', '2-5-4'),

  // Level 2 to Level 3 - 客户分级
  createEdge('2-5-1', '3-5-1-1'),
  createEdge('2-5-1', '3-5-1-2'),
  createEdge('2-5-1', '3-5-1-3'),

  // Level 2 to Level 3 - 人的特征分析
  createEdge('2-5-2', '3-5-2-1'),
  createEdge('2-5-2', '3-5-2-2'),
  createEdge('2-5-2', '3-5-2-3'),

  // Level 2 to Level 3 - 高价值信号
  createEdge('2-5-3', '3-5-3-1'),
  createEdge('2-5-3', '3-5-3-2'),

  // Level 2 to Level 3 - 负向指标
  createEdge('2-5-4', '3-5-4-1'),

  // Level 1 to Level 2 - 触达时间轴细节
  createEdge('1-6', '2-6-1'),
  createEdge('1-6', '2-6-2'),
  createEdge('1-6', '2-6-3'),
  createEdge('1-6', '2-6-4'),

  // Level 1 to Level 2 - 业务场景
  createEdge('1-7', '2-7-1'),
];
