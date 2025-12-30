import React, { useState } from 'react';
import { graphData } from '@/data/graphData';
import { Search, Filter, BarChart3 } from 'lucide-react';

interface ControlPanelProps {
  onSearch?: (query: string) => void;
  onFilter?: (category: string | null) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ onSearch, onFilter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(
    new Set(graphData.nodes.map(n => n.category).filter(Boolean))
  );

  const categoryLabels: Record<string, string> = {
    place: '📍 地点',
    time: '⏰ 时间',
    activity: '🎯 活动',
    emotion: '💭 情感',
    element: '✨ 元素'
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
    onFilter?.(category);
  };

  const filteredNodeCount = graphData.nodes.filter(node => {
    const matchesSearch = node.label.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || node.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).length;

  return (
    <div className="fixed left-4 top-4 w-80 bg-gradient-to-b from-card to-muted rounded-xl shadow-2xl p-5 z-40 max-h-[calc(100vh-2rem)] overflow-y-auto border border-border/50 backdrop-blur-sm">
      {/* 标题 */}
      <div className="mb-6">
        <h1 
          className="text-2xl font-bold text-foreground mb-1" 
          style={{ fontFamily: 'Merriweather, serif' }}
        >
          知识图谱
        </h1>
        <p className="text-xs text-muted-foreground">探索节点间的关系</p>
      </div>

      {/* 搜索框 */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="搜索节点..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={18} className="text-accent" />
          <h3 className="font-semibold text-sm text-foreground">分类筛选</h3>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => handleCategoryFilter(null)}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
              selectedCategory === null
                ? 'bg-accent text-accent-foreground shadow-md'
                : 'bg-white/40 text-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            全部
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category || null)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-accent text-accent-foreground shadow-md'
                  : 'bg-white/40 text-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {categoryLabels[category || ''] || category}
            </button>
          ))}
        </div>
      </div>

      {/* 节点列表 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-foreground">节点列表</h3>
          <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full font-medium">
            {filteredNodeCount}
          </span>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {graphData.nodes
            .filter(node => {
              const matchesSearch = node.label.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesCategory = !selectedCategory || node.category === selectedCategory;
              return matchesSearch && matchesCategory;
            })
            .map((node) => (
              <div
                key={node.id}
                className="p-3 bg-white/40 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer text-sm group border border-transparent hover:border-accent/50"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform"
                    style={{ backgroundColor: node.color || '#e8a87c' }}
                  />
                  <span className="font-medium truncate">{node.label}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 统计信息 */}
      <div className="pt-4 border-t border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={16} className="text-muted-foreground" />
          <h4 className="text-xs font-semibold text-muted-foreground">统计</h4>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white/30 rounded-lg text-center">
            <p className="text-2xl font-bold text-accent">{graphData.nodes.length}</p>
            <p className="text-xs text-muted-foreground mt-1">总节点数</p>
          </div>
          <div className="p-3 bg-white/30 rounded-lg text-center">
            <p className="text-2xl font-bold text-accent">{graphData.links.length}</p>
            <p className="text-xs text-muted-foreground mt-1">总连接数</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
