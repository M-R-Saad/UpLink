import { formatSalary } from "../../lib/utils";

export default function SalaryRange({ salary }) {
  if (!salary) return null;
  return (
    <span className="text-xs font-medium" style={{ color: "var(--text-sub)" }}>
      {formatSalary(salary)}
    </span>
  );
}
