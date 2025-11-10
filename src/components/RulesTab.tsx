import { useCallback, useState, type PropsWithChildren } from "react";
import { RulesCanvas } from "./RulesCanvas";
import { RuleForm } from "./RuleForm";

export type Rule = {
    id: string;
    expression: string;
    action: "allow" | "block";
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
      expression: 'country == "north korea"',
      action: "allow",
    },
  ];
  
  export const RulesTab = () => {
    const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
    const [rules, setRules] = useState<Rule[]>(initialRules);
  
    const addNewRule = useCallback(() => {
      setRules([
        ...rules,
        {
          id: generateRuleId(),
          expression: "bot == true",
          action: "block",
        },
      ]);
    }, [rules]);

    const deleteRule = useCallback((id: string) => {
      setRules(rules.filter((rule) => rule.id !== id));
      if (selectedRuleId === id) {
        setSelectedRuleId(null);
      }
    }, [rules, selectedRuleId]);

    const updateRule = useCallback((updatedRule: Rule) => {
      setRules(rules.map((rule) => 
        rule.id === updatedRule.id ? updatedRule : rule
      ));
    }, [rules]);
  
    const selectedRule = rules.find((rule) => rule.id === selectedRuleId) || null;
  
    return (
      <div className="flex h-screen">
        <div className="flex-1">
          <RulesCanvas
            rules={rules}
            selectedRuleId={selectedRuleId}
            setSelectedRuleId={setSelectedRuleId}
            addNewRule={addNewRule}
            deleteRule={deleteRule}
          />
        </div>
        <Sidebar>
          {selectedRule && <RuleForm rule={selectedRule} onUpdateRule={updateRule} />}
        </Sidebar>
      </div>
    );
  };

  const Sidebar = ({ children }: PropsWithChildren) => {
    return (
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 flex flex-col h-full">
        {children || (
          <>
            <h2 className="text-lg font-semibold mb-4">Rule Editor</h2>
            <p className="text-gray-500">Select a rule to edit</p>
          </>
        )}
      </div>
    );
  };