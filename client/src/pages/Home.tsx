import React, { useState } from 'react';
import KnowledgeGraph from '@/components/KnowledgeGraph';
import ControlPanel from '@/components/ControlPanel';
import NodeInfoPanel from '@/components/NodeInfoPanel';
import HelpCard from '@/components/HelpCard';
import { graphData, GraphNode } from '@/data/graphData';

/**
 * 知识图谱主页
 * 
 * 设计理念：温暖叙事性设计
 * - 中心放射状布局，主节点突出
 * - 温暖色调（米色、深棕、橙色、紫色）
 * - 故事驱动的交互体验
 * - 弹性流畅的动画效果
 */
export default function Home() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 过滤图数据
  const filteredData = {
    nodes: graphData.nodes.filter(node => {
      const matchesSearch = node.label.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || node.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }),
    links: graphData.links.filter(link => {
      const sourceExists = graphData.nodes.find(n => n.id === link.source)?.label.toLowerCase().includes(searchQuery.toLowerCase());
      const targetExists = graphData.nodes.find(n => n.id === link.target)?.label.toLowerCase().includes(searchQuery.toLowerCase());
      const sourceCategoryMatch = !selectedCategory || graphData.nodes.find(n => n.id === link.source)?.category === selectedCategory;
      const targetCategoryMatch = !selectedCategory || graphData.nodes.find(n => n.id === link.target)?.category === selectedCategory;
      
      return (sourceExists || targetExists) && (sourceCategoryMatch || targetCategoryMatch);
    })
  };

  return (
    <div className="w-full h-screen flex flex-col bg-background overflow-hidden">
      {/* 顶部标题栏 */}
      <div className="h-16 bg-gradient-to-r from-card to-muted border-b border-border/50 flex items-center px-6 shadow-sm">
        <div className="flex-1">
          <h1 
            className="text-2xl font-bold text-foreground" 
            style={{ fontFamily: 'Merriweather, serif' }}
          >
            动态交互知识图谱
          </h1>
          <p className="text-xs text-muted-foreground">探索节点之间的关系与连接</p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p>节点: <span className="font-semibold text-accent">{filteredData.nodes.length}</span></p>
          <p>连接: <span className="font-semibold text-accent">{filteredData.links.length}</span></p>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 relative overflow-hidden">
        {/* 知识图谱画布 */}
        <div className="w-full h-full">
          <KnowledgeGraph 
            data={filteredData}
            onNodeClick={setSelectedNode}
          />
        </div>

        {/* 控制面板 */}
        <ControlPanel
          onSearch={setSearchQuery}
          onFilter={setSelectedCategory}
        />

        {/* 节点信息面板 */}
        <NodeInfoPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />

        {/* 帮助卡片 */}
        <HelpCard />
      </div>
    </div>
  );
}
