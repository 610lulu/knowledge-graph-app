export interface GraphNode {
  id: string;
  label: string;
  description?: string;
  category?: string;
  color?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  label?: string;
  strength?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export const graphData: GraphData = {
  nodes: [
    {
      id: "小学",
      label: "小学",
      description: "童年的学校生活",
      category: "place",
      color: "#e8a87c"
    },
    {
      id: "小时候",
      label: "小时候",
      description: "美好的童年时光",
      category: "time",
      color: "#d4b5e8"
    },
    {
      id: "这个地方",
      label: "这个地方",
      description: "承载回忆的地点",
      category: "place",
      color: "#e8a87c"
    },
    {
      id: "小花园",
      label: "小花园",
      description: "放学后的活动场所",
      category: "place",
      color: "#c4a57b"
    },
    {
      id: "打羽毛球",
      label: "打羽毛球",
      description: "童年的运动回忆",
      category: "activity",
      color: "#8b6f47"
    },
    {
      id: "放学",
      label: "放学",
      description: "自由时光的开始",
      category: "time",
      color: "#d4b5e8"
    },
    {
      id: "巷子",
      label: "巷子",
      description: "探险的地方",
      category: "place",
      color: "#c4a57b"
    },
    {
      id: "闲逛",
      label: "闲逛",
      description: "无目的的漫步",
      category: "activity",
      color: "#8b6f47"
    },
    {
      id: "不开心",
      label: "不开心",
      description: "情绪的低谷",
      category: "emotion",
      color: "#c84c3c"
    },
    {
      id: "天光",
      label: "天光",
      description: "自然的光线",
      category: "element",
      color: "#f5e6d3"
    },
    {
      id: "治愈",
      label: "治愈",
      description: "心灵的抚慰",
      category: "emotion",
      color: "#e8a87c"
    }
  ],
  links: [
    {
      source: "小学",
      target: "小时候",
      label: "associated_with",
      strength: 0.8
    },
    {
      source: "小学",
      target: "这个地方",
      label: "part_of",
      strength: 0.9
    },
    {
      source: "小花园",
      target: "这个地方",
      label: "part_of",
      strength: 0.9
    },
    {
      source: "打羽毛球",
      target: "小花园",
      label: "located_in",
      strength: 0.85
    },
    {
      source: "打羽毛球",
      target: "放学",
      label: "during",
      strength: 0.8
    },
    {
      source: "巷子",
      target: "这个地方",
      label: "part_of",
      strength: 0.9
    },
    {
      source: "闲逛",
      target: "巷子",
      label: "located_in",
      strength: 0.85
    },
    {
      source: "不开心",
      target: "闲逛",
      label: "triggers",
      strength: 0.7
    },
    {
      source: "天光",
      target: "治愈",
      label: "evokes",
      strength: 0.95
    },
    {
      source: "小花园",
      target: "天光",
      label: "contains",
      strength: 0.8
    },
    {
      source: "巷子",
      target: "天光",
      label: "contains",
      strength: 0.75
    }
  ]
};
