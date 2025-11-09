import type { Rule } from "./RulesTab";

type RuleFormProps = {
  rule: Rule;
  onUpdateRule: (rule: Rule) => void;
};

export const RuleForm = ({ rule, onUpdateRule }: RuleFormProps) => {
  const handleExpressionChange = (expression: string) => {
    onUpdateRule({
      ...rule,
      expression,
    });
  };

  const handleActionChange = (action: "allow" | "block") => {
    onUpdateRule({
      ...rule,
      action,
    });
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Edit Rule</h2>
      
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="expression" className="block text-sm font-medium text-gray-700 mb-1">
            Expression
          </label>
          <input
            id="expression"
            type="text"
            value={rule.expression}
            onChange={(e) => handleExpressionChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., bot == true"
          />
        </div>

        <div>
          <label htmlFor="action" className="block text-sm font-medium text-gray-700 mb-1">
            Action
          </label>
          <select
            id="action"
            value={rule.action}
            onChange={(e) => handleActionChange(e.target.value as "allow" | "block")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="allow">Allow</option>
            <option value="block">Block</option>
          </select>
        </div>
      </div>
    </>
  );
};

