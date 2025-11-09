import { useCallback, useState } from "react";
import { RulesCanvas } from "./RulesCanvas";

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
      expression: 'country == "china"',
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
    }, [rules]);
  
  
    return (
      <div>
        <RulesCanvas
          rules={rules}
          selectedRuleId={selectedRuleId}
          setSelectedRuleId={setSelectedRuleId}
          addNewRule={addNewRule}
          deleteRule={deleteRule}
        />
      </div>
    );
  };