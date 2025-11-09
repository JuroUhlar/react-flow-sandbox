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
import { useState, useMemo } from "react";

type Rule = {
  id: string;
  expression: string;
  action: "allow" | "block";
};

type RuleNode = Node<Rule, "rule">;

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
const RulesEditor = (props: {
  rules: Rule[];
  selectedRuleId: string | null;
  setSelectedRuleId: (id: string | null) => void;
}) => {
  const nodes: RuleNode[] = useMemo(
    () =>
      props.rules.map((rule, index) => ({
        id: rule.id,
        position: { x: 0, y: index * 150 },
        data: rule,
        type: "rule",
        selected: rule.id === props.selectedRuleId,
        draggable: false, // Disable dragging on individual nodes
      })),
    [props.rules, props.selectedRuleId]
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

  return (
    <>
      <div style={{ height: "100vh", width: "100vw" }}>
        {props.selectedRuleId && (
          <div className="absolute top-4 left-4 z-10 bg-white p-2 border border-gray-300 rounded shadow">
            Selected: {props.selectedRuleId}
          </div>
        )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          nodesDraggable={false} // Disable dragging globally
          nodesConnectable={false} // Disable edge connections (optional)
          fitView
          onNodeClick={(_event, node) => {
            props.setSelectedRuleId(node.id);
          }}
          onPaneClick={() => {
            props.setSelectedRuleId(null);
          }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
};

const App = () => {
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

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
      <RulesEditor
        rules={rules}
        selectedRuleId={selectedRuleId}
        setSelectedRuleId={setSelectedRuleId}
      />
    </div>
  );
};

export default App;
