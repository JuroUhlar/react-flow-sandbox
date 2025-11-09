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

type RuleNodeComponent = Node<Rule, "rule">;
type NewRuleNodeComponent = Node<{ onClick?: () => void }, "newRuleButton">;
type AppNode = RuleNodeComponent | NewRuleNodeComponent;

const nodeTypes = {
  rule: RuleNodeComponent,
  newRuleButton: NewRuleNodeComponent,
};

function RuleNodeComponent(props: NodeProps<RuleNodeComponent>) {
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

function NewRuleNodeComponent(props: NodeProps<NewRuleNodeComponent>) {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <button 
        className="focus:outline-none focus:ring-0 border-none"
        onClick={() => {
          props.data.onClick?.();
        }}
      >
        New Rule
      </button>
    </>
  );
}

type RulesEditorProps = {
  rules: Rule[];
  selectedRuleId: string | null;
  setSelectedRuleId: (id: string | null) => void;
  addNewRule: () => void;
};

// Rules tab
const RulesEditor = ({ rules, selectedRuleId, setSelectedRuleId, addNewRule }: RulesEditorProps) => {

  const nodes: AppNode[] = useMemo(
    () => [
      ...rules.map((rule, index) => ({
        id: rule.id,
        position: { x: 0, y: index * 150 },
        data: rule,
        type: "rule" as const,
        selected: rule.id === selectedRuleId,
        draggable: false, // Disable dragging on individual nodes
      })),
      {
        id: "newRuleButton",
        position: { x: 0, y: rules.length * 150 },
        type: "newRuleButton" as const,
        selected: false,
        data: {
          onClick: addNewRule,
        },
        draggable: false, // Disable dragging on individual nodes
      },
    ],
    [rules, selectedRuleId, addNewRule]
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
          onNodeClick={(_event, node) => {
            if (node.type === "rule") {
              setSelectedRuleId(node.id);
            }
          }}
          onPaneClick={() => {
            setSelectedRuleId(null);
          }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
};

const generateRuleId = () => {
  return `r${Math.random().toString(36).substring(2, 15)}`;
};

const initialRules: Rule[] = [
  {
    id: generateRuleId(),
    expression: "bot == true",
    action: "allow",
  },
  {
    id: generateRuleId(),
    expression: 'country == "china"',
    action: "allow",
  },
];

const App = () => {
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [rules, setRules] = useState<Rule[]>(initialRules);

  const addNewRule = () => {
    setRules([
      ...rules,
      {
        id: generateRuleId(),
        expression: "bot == true",
        action: "block",
      },
    ]);
  };


  return (
    <div>
      <RulesEditor
        rules={rules}
        selectedRuleId={selectedRuleId}
        setSelectedRuleId={setSelectedRuleId}
        addNewRule={addNewRule}
      />
    </div>
  );
};

export default App;
