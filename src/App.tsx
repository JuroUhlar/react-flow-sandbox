import "./App.css";
import "@xyflow/react/dist/style.css";
import '@xyflow/react/dist/base.css';
import { ReactFlow, Background, Controls, type NodeProps } from "@xyflow/react";
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
  return <div className="bg-white p-2 rounded-md">
    <b>IF</b>
    <p>{props.data.expression}</p>
    <b>THEN</b>
    <p>{props.data.action}</p>
    </div>;
}

const App = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

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

  return (
    <>
      <div style={{ height: "100vh", width: "100vw" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
};

export default App;
