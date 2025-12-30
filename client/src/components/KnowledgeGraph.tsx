import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GraphData, GraphNode, GraphLink } from '@/data/graphData';

interface KnowledgeGraphProps {
  data: GraphData;
  onNodeClick?: (node: GraphNode) => void;
}

interface D3Node extends GraphNode {
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
}

interface D3Link {
  source: D3Node | string;
  target: D3Node | string;
  label?: string;
  strength?: number;
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ data, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // 获取节点大小
  const getNodeRadius = (node: any) => {
    const connections = data.links.filter(l => l.source === node.id || l.target === node.id).length;
    const baseSize = node.category === 'place' ? 35 : 20;
    return baseSize + connections * 2;
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 清空之前的内容
    d3.select(svgRef.current).selectAll("*").remove();

    // 创建SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // 添加渐变背景定义
    const defs = svg.append('defs');

    // 背景渐变
    defs.append('linearGradient')
      .attr('id', 'bgGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%')
      .selectAll('stop')
      .data([
        { offset: '0%', color: '#faf8f3' },
        { offset: '100%', color: '#f5e6d3' }
      ])
      .enter()
      .append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color);

    // 节点光晕滤镜
    const filter = defs.append('filter')
      .attr('id', 'glow');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');

    filter.append('feMerge')
      .selectAll('feMergeNode')
      .data([0, 1])
      .enter()
      .append('feMergeNode')
      .attr('in', (d, i) => i === 0 ? 'coloredBlur' : 'SourceGraphic');

    // 背景
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#bgGradient)');

    // 创建力导向图模拟
    const simulation = d3.forceSimulation(data.nodes as D3Node[])
      .force('link', d3.forceLink<D3Node, any>(data.links as any)
        .id((d: D3Node) => d.id)
        .distance((d: D3Link) => {
          const strength = (d as any).strength || 0.5;
          return 120 + (1 - strength) * 80;
        })
        .strength((d: D3Link) => {
          const strength = (d as any).strength || 0.5;
          return strength * 0.5;
        })
      )
      .force('charge', d3.forceManyBody<D3Node>().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<D3Node>().radius((d: any) => {
        return getNodeRadius(d) + 10;
      }))
      .alpha(1)
      .alphaDecay(0.02);

    // 创建链接线组
    const linkGroup = svg.append('g')
      .attr('class', 'links');

    // 创建节点组
    const nodeGroup = svg.append('g')
      .attr('class', 'nodes');

    // 创建标签组
    const labelGroup = svg.append('g')
      .attr('class', 'labels');

    // 创建链接线
    const links = linkGroup
      .selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .attr('class', 'graph-link')
      .attr('stroke', '#d4b5e8')
      .attr('stroke-width', (d: any) => 1.5 + (d.strength || 0.5) * 2)
      .attr('opacity', 0.5)
      .attr('stroke-linecap', 'round');

    // 创建节点背景（用于光晕效果）
    const nodeBackgrounds = nodeGroup
      .selectAll('circle.node-bg')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('class', 'node-bg')
      .attr('r', (d: any) => getNodeRadius(d))
      .attr('fill', (d: any) => d.color || '#e8a87c')
      .attr('opacity', 0.2)
      .attr('filter', 'url(#glow)');

    // 创建节点
    const nodes = nodeGroup
      .selectAll('circle.node')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('class', 'graph-node')
      .attr('r', (d: any) => getNodeRadius(d))
      .attr('fill', (d: any) => d.color || '#e8a87c')
      .attr('stroke', '#4a3728')
      .attr('stroke-width', 2.5)
      .attr('opacity', 0.9)
      .style('cursor', 'pointer')
      .on('click', (event: any, d: any) => {
        event.stopPropagation();
        setSelectedNode(d);
        onNodeClick?.(d);
      })
      .on('mouseover', function(event: any, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', (d: any) => getNodeRadius(d) + 8)
          .attr('opacity', 1)
          .attr('stroke-width', 3);

        // 高亮相关链接
        links.attr('opacity', (link: any) => {
          return link.source.id === d.id || link.target.id === d.id ? 0.8 : 0.2;
        })
        .attr('stroke-width', (link: any) => {
          const baseWidth = 1.5 + (link.strength || 0.5) * 2;
          return link.source.id === d.id || link.target.id === d.id ? baseWidth + 1 : baseWidth;
        });

        // 高亮相关节点
        nodes.attr('opacity', (node: any) => {
          const isConnected = data.links.some(link => 
            (link.source === d.id && link.target === node.id) ||
            (link.target === d.id && link.source === node.id)
          );
          return isConnected || node.id === d.id ? 1 : 0.3;
        });
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', (d: any) => getNodeRadius(d))
          .attr('opacity', 0.9)
          .attr('stroke-width', 2.5);

        // 恢复链接
        links.attr('opacity', 0.5)
          .attr('stroke-width', (d: any) => 1.5 + (d.strength || 0.5) * 2);

        // 恢复节点
        nodes.attr('opacity', 0.9);
      });

    // 创建标签
    const labels = labelGroup
      .selectAll('text')
      .data(data.nodes)
      .enter()
      .append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .attr('font-size', '13px')
      .attr('font-family', 'Lora, serif')
      .attr('fill', '#4a3728')
      .attr('font-weight', '600')
      .text((d: any) => d.label)
      .style('pointer-events', 'none')
      .style('user-select', 'none');

    // 更新位置
    simulation.on('tick', () => {
      links
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodes
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      nodeBackgrounds
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      labels
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

    // 让节点稳定后固定位置
    setTimeout(() => {
      simulation.alpha(0);
      data.nodes.forEach((node: any) => {
        node.fx = node.x;
        node.fy = node.y;
      });
    }, 3000);

    // 缩放功能
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .on('zoom', (event) => {
        svg.selectAll('g').attr('transform', event.transform);
      });

    svg.call(zoom);

    // 初始缩放
    svg.call(zoom.transform as any, d3.zoomIdentity.translate(0, 0).scale(1));

    // 清理
    return () => {
      simulation.stop();
    };
  }, [data, onNodeClick]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default KnowledgeGraph;
