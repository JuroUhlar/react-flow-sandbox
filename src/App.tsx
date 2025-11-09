import "./App.css";
import "@xyflow/react/dist/style.css";
import "@xyflow/react/dist/base.css";
import {
  ReactFlow,
  Background,
  Controls,
  type NodeProps,
  Handle,
  Position,
} from "@xyflow/react";
import {
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
} from "@xyflow/react";
import { useCallback, useState } from "react";

type Rule = {
  id: string;
  expression: string;
  action: "allow" | "block";
};

const rules: Rule[] = [
  {
    id: "r1",
    expression: "bot == true",
    action: "allow",
  },
  {
    id: "r2",
    expression: 'country == "china"',
    action: "allow",
  },
];

type RuleNode = Node<Rule, "rule">;

type AppNode = RuleNode;

const initialNodes: RuleNode[] = rules.map((rule, index) => ({
  id: rule.id,
  position: { x: index * 100, y: index * 100 },
  data: rule,
  type: "rule",
}));

const initialEdges: Edge[] = [];
for (let i = 0; i < initialNodes.length - 1; i++) {
  initialEdges.push({
    id: `e${i}-${i + 1}`,
    source: initialNodes[i].id,
    target: initialNodes[i + 1].id,
    // label: "if not, check"
  });
}

const nodeTypes = {
  rule: RuleNode,
  // newRuleButton: NewRuleButtonNode,
};

function RuleNode(props: NodeProps<RuleNode>) {
  const isSelected = props.selected;
  
  return (
    <div 
      className={`p-2 border-2 ${
        isSelected 
          ? "bg-blue-100 border-blue-500 shadow-lg" 
          : "bg-white border-black"
      }`}
    >
      <b>IF</b>
      <p>{props.data.expression}</p>
      <b>THEN</b>
      <p>{props.data.action}</p>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}


const App = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onNodesChange: OnNodesChange<AppNode> = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  const onSelectionChange = useCallback(
    (params: { nodes: AppNode[]; edges: Edge[] }) => {
      // Track which node is selected (if any)
      const selectedNode = params.nodes.find((node) => node.selected);
      setSelectedNodeId(selectedNode?.id ?? null);
    },
    []
  );

  return (
    <>
      <div style={{ height: "100vh", width: "100vw" }}>
        {selectedNodeId && (
          <div className="absolute top-4 left-4 z-10 bg-white p-2 border border-gray-300 rounded shadow">
            Selected: {selectedNodeId}
          </div>
        )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
};

export default App;
