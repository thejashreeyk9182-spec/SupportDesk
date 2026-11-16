
import "./Alert.css";

interface AlertProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
}

const Alert = ({ message, type = "info" }: AlertProps) => {
  if (!message) return null;

  return (
    <div
      className={`alert alert-${type}`}
      role="alert"
    >
      {message}
    </div>
  );
};

export default Alert;
