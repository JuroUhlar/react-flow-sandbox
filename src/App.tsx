/* eslint-disable @typescript-eslint/no-unused-vars */
// import "./App.css";
import "@xyflow/react/dist/style.css";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type FitViewOptions,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type OnNodeDrag,
  type DefaultEdgeOptions,
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
  position: { x: 0, y: index * 100 },
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
      {/* <h1>React Flow Sandbox</h1> */}
      <div style={{ height: "100vh", width: "100vw" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
};

export default App;
