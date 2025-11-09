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
  type Node,
  type Edge,

} from "@xyflow/react";
import { useCallback, useState } from "react";

type Rule = {
  id: string;
  expression: string;
  action: "allow" | "block";
};



type RuleNode = Node<Rule, "rule">;

type AppNode = RuleNode;



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

// Rules tab
const RulesEditor = (props: { rules: Rule[] }) => {
  // const [nodes, setNodes] = useState(initialNodes);
  // const [edges, setEdges] = useState(initialEdges);

  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  

  const nodes: RuleNode[] = props.rules.map((rule, index) => ({
    id: rule.id,
    position: { x: index, y: index * 150 },
    data: rule,
    type: "rule",
    selected: rule.id === selectedRuleId,
  }));

  const edges: Edge[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      id: `e${i}-${i + 1}`,
      source: nodes[i].id,
      target: nodes[i + 1].id,
    });
  }


  // const onNodesChange: OnNodesChange<AppNode> = useCallback(
  //   (changes) =>
  //     setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
  //   []
  // );
  // const onEdgesChange: OnEdgesChange = useCallback(
  //   (changes) =>
  //     setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
  //   []
  // );

  const onSelectionChange = useCallback(
    (params: { nodes: AppNode[]; edges: Edge[] }) => {
      // Track which node is selected (if any)
      const selectedNode = params.nodes.find((node) => node.selected);
      setSelectedRuleId(selectedNode?.id ?? null);
    },
    []
  );

  return (
    <>
      <div style={{ height: "100vh", width: "100vw" }}>
        {selectedRuleId && (
          <div className="absolute top-4 left-4 z-10 bg-white p-2 border border-gray-300 rounded shadow">
            Selected: {selectedRuleId}
          </div>
        )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          // onNodesChange={onNodesChange}
          // onEdgesChange={onEdgesChange}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          fitView
          onNodeClick={(_event, node) => setSelectedRuleId(node.id)}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
};

const App = () => {

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

  return (
    <div>
      <RulesEditor rules={rules} />
    </div>
  );
};

export default App;
