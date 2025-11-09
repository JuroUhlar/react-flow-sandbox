import {
  ReactFlow,
  Background,
  Controls,
  type NodeProps,
  Handle,
  Position,
  useReactFlow,
} from "@xyflow/react";
import { type Node, type Edge } from "@xyflow/react";
import { useMemo } from "react";
import type { Rule } from "./RulesTab";

type RuleNodeComponent = Node<Rule & { deleteRule: () => void }, "rule">;
type NewRuleNodeComponent = Node<{ onClick?: () => void }, "newRuleButton">;
type AppNode = RuleNodeComponent | NewRuleNodeComponent;

const nodeTypes = {
  rule: RuleNodeComponent,
  newRuleButton: NewRuleNodeComponent,
};

function RuleNodeComponent(props: NodeProps<RuleNodeComponent>) {
  const { fitView } = useReactFlow();

  return (
    <div
      className={`p-2 border-2 flex flex-row ${
        props.selected
          ? "bg-blue-100 border-blue-500 shadow-lg"
          : "bg-white border-black"
      } gap-2`}
    >
      <div className="flex flex-col gap-2">
        <b>IF</b>
        <p>{props.data.expression}</p>
        <b>THEN</b>
        <p>{props.data.action}</p>
      </div>
      <div>
        <button
          className="nopan"
          onClick={() => {
            props.data.deleteRule();
            fitView();
          }}
        >
          ❌
        </button>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function NewRuleNodeComponent(props: NodeProps<NewRuleNodeComponent>) {
  const { fitView } = useReactFlow();

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <button
        // nopan prevents the button clicks from dragging canvas
        className={`focus:outline-none focus:ring-0 border-none nopan`}
        onClick={() => {
          props.data.onClick?.();
          fitView();
        }}
      >
        ➕ New Rule
      </button>
    </>
  );
}

type RulesEditorProps = {
  rules: Rule[];
  selectedRuleId: string | null;
  setSelectedRuleId: (id: string | null) => void;
  addNewRule: () => void;
  deleteRule: (id: string) => void;
};

// Rules tab
export const RulesCanvas = ({
  rules,
  selectedRuleId,
  setSelectedRuleId,
  addNewRule,
  deleteRule,
}: RulesEditorProps) => {
  const nodes: AppNode[] = useMemo(() => {
    return [
      ...rules.map((rule, index) => ({
        id: rule.id,
        position: { x: 0, y: index * 250 },
        data: {
          ...rule,
          deleteRule: () => deleteRule(rule.id),
        },
        type: "rule" as const,
        selected: rule.id === selectedRuleId,
        draggable: false, // Disable dragging on individual nodes
      })),
      {
        id: "newRuleButton",
        position: { x: 0, y: rules.length * 250 },
        type: "newRuleButton" as const,
        selected: false,
        data: {
          onClick: addNewRule,
        },
        draggable: false, // Disable dragging on individual nodes
      },
    ];
  }, [rules, selectedRuleId, addNewRule, deleteRule]);

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
