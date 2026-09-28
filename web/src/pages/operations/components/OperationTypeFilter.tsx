import { Segmented } from "antd";
import type { OperationType } from "../../../types";

type OperationTypeFilterProps = {
  value: OperationType;
  onChange: (value: OperationType) => void;
};

const options = [
  { label: "Все", value: "all" },
  { label: "Доходы", value: "income" },
  { label: "Расходы", value: "expense" },
] satisfies { label: string; value: OperationType }[];

export function OperationTypeFilter({
  value,
  onChange,
}: OperationTypeFilterProps) {
  return (
    <Segmented<OperationType>
      value={value}
      options={options}
      onChange={onChange}
    />
  );
}
