"use client";

import { useMemo } from "react";
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";

interface WorkflowGraphProps {
  nodes?: Node[];
  edges?: Edge[];
  height?: number;
}

export function WorkflowGraph({ nodes = [], edges = [], height = 420 }: WorkflowGraphProps) {
  const preparedNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        draggable: false,
        selectable: false,
      })),
    [nodes]
  );

  const preparedEdges = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        type: edge.type ?? "smoothstep",
        markerEnd: edge.markerEnd ?? { type: MarkerType.ArrowClosed },
      })),
    [edges]
  );

  if (preparedNodes.length === 0) {
    return (
      <div className="mb-6 border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
        <p className="mb-0 text-sm text-gray-600 dark:text-gray-400">No graph nodes provided.</p>
      </div>
    );
  }

  return (
    <section className="mb-8 border border-gray-300 p-4 dark:border-gray-700">
      <p className="mb-3 text-xs font-bold uppercase text-gray-600 dark:text-gray-400">Workflow graph</p>
      <div className="w-full overflow-hidden rounded border border-gray-300 dark:border-gray-700" style={{ height }}>
        <ReactFlow
          nodes={preparedNodes}
          edges={preparedEdges}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
          minZoom={0.4}
          maxZoom={1.8}
        >
          <Background gap={18} size={1} />
          <MiniMap zoomable pannable />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </section>
  );
}
