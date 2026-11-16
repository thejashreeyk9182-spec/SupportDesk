
import "./Badge.css";

interface BadgeProps {
  label: string;
  variant?: "success" | "warning" | "danger" | "info" | "default";
}

const Badge = ({
  label,
  variant = "default",
}: BadgeProps) => {
  return (
    <span className={`badge badge-${variant}`}>
      {label}
    </span>
  );
};

export default Badge;
