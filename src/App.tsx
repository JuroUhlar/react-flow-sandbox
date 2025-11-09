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
import { type Node, type Edge } from "@xyflow/react";
import { useCallback, useState, useMemo } from "react";

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
  return (
    <div
      className={`p-2 border-2 ${
        props.selected
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
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

  const nodes: RuleNode[] = useMemo(
    () =>
      props.rules.map((rule, index) => ({
        id: rule.id,
        position: { x: 0, y: index * 150 },
        data: rule,
        type: "rule",
        selected: rule.id === selectedRuleId,
        draggable: false, // Disable dragging on individual nodes
      })),
    [props.rules, selectedRuleId]
  );

  const edges: Edge[] = useMemo(() => {
    const result: Edge[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      result.push({
        id: `e${i}-${i + 1}`,
        source: nodes[i].id,
        target: nodes[i + 1].id,
      });
    }
    return result;
  }, [nodes]);

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: AppNode) => {
      setSelectedRuleId(node.id);
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
          nodeTypes={nodeTypes}
          nodesDraggable={false} // Disable dragging globally
          nodesConnectable={false} // Disable edge connections (optional)
          fitView
          onNodeClick={handleNodeClick}
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
