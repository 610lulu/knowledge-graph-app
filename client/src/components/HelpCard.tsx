import React, { useState } from 'react';
import { ChevronDown, Mouse, Zap, Search } from 'lucide-react';

export const HelpCard: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-30 max-w-xs">
      <div className="bg-gradient-to-br from-card to-muted rounded-xl shadow-xl border border-border/50 backdrop-blur-sm overflow-hidden">
        {/* 折叠头 */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent/10 transition-colors"
        >
          <span className="font-semibold text-sm text-foreground">交互提示</span>
          <ChevronDown 
            size={18} 
            className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {/* 展开内容 */}
        {isExpanded && (
          <div className="px-4 py-3 border-t border-border/50 space-y-3 bg-white/20">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Mouse size={16} className="text-accent mt-0.5" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">点击节点</p>
                <p className="text-xs text-muted-foreground mt-0.5">查看节点详情和相关信息</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Zap size={16} className="text-accent mt-0.5" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">拖拽节点</p>
                <p className="text-xs text-muted-foreground mt-0.5">自由移动节点或整个图谱</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Search size={16} className="text-accent mt-0.5" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">搜索和筛选</p>
                <p className="text-xs text-muted-foreground mt-0.5">在左侧面板快速查找节点</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <span className="text-xs font-bold text-accent">🔍</span>
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">滚轮缩放</p>
                <p className="text-xs text-muted-foreground mt-0.5">放大或缩小整个图谱</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <span className="text-xs font-bold text-accent">✨</span>
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">悬停高亮</p>
                <p className="text-xs text-muted-foreground mt-0.5">悬停节点查看相关连接</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpCard;
