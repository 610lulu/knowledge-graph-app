import React from 'react';
import { GraphNode, graphData } from '@/data/graphData';
import { X, Link2 } from 'lucide-react';

interface NodeInfoPanelProps {
  node: GraphNode | null;
  onClose: () => void;
}

export const NodeInfoPanel: React.FC<NodeInfoPanelProps> = ({ node, onClose }) => {
  if (!node) return null;

  // 获取相关节点
  const relatedNodes = graphData.links
    .filter(link => link.source === node.id || link.target === node.id)
    .map(link => {
      const relatedId = link.source === node.id ? link.target : link.source;
      return {
        node: graphData.nodes.find(n => n.id === relatedId),
        relation: link.label
      };
    })
    .filter(item => item.node);

  const categoryLabels: Record<string, string> = {
    place: '📍 地点',
    time: '⏰ 时间',
    activity: '🎯 活动',
    emotion: '💭 情感',
    element: '✨ 元素'
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-gradient-to-b from-card to-muted shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300">
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors z-10"
      >
        <X size={20} />
      </button>

      {/* 内容 */}
      <div className="p-8 pt-12">
        {/* 节点标题区域 */}
        <div className="mb-8 text-center">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 shadow-lg border-4 border-card transform transition-transform duration-300 hover:scale-110"
            style={{ 
              backgroundColor: node.color || '#e8a87c',
              boxShadow: `0 0 20px ${node.color || '#e8a87c'}40`
            }}
          />
          <h2 
            className="text-3xl font-bold text-foreground mb-2" 
            style={{ fontFamily: 'Merriweather, serif' }}
          >
            {node.label}
          </h2>
          {node.category && (
            <p className="text-sm text-muted-foreground font-medium">
              {categoryLabels[node.category] || node.category}
            </p>
          )}
        </div>

        {/* 描述 */}
        {node.description && (
          <div className="mb-8 p-5 bg-white/50 rounded-xl border border-border/50 backdrop-blur-sm">
            <p className="text-sm leading-relaxed text-foreground font-medium">
              {node.description}
            </p>
          </div>
        )}

        {/* 相关节点 */}
        {relatedNodes.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Link2 size={18} className="text-accent" />
              <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: 'Merriweather, serif' }}>
                相关节点 ({relatedNodes.length})
              </h3>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {relatedNodes.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white/40 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200 cursor-pointer border border-transparent hover:border-accent/50 group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform"
                      style={{ backgroundColor: item.node?.color || '#e8a87c' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {item.node?.label}
                      </p>
                      {item.relation && (
                        <p className="text-xs text-muted-foreground group-hover:text-accent-foreground/80 transition-colors">
                          {item.relation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 统计信息 */}
        <div className="pt-6 border-t border-border/50 text-xs text-muted-foreground space-y-2">
          <div className="flex justify-between">
            <span>相关节点数</span>
            <span className="font-semibold text-accent">{relatedNodes.length}</span>
          </div>
          <div className="flex justify-between">
            <span>节点类型</span>
            <span className="font-semibold text-foreground">{node.category || '未分类'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeInfoPanel;
