
import "./Loader.css";

interface LoaderProps {
  message?: string;
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
}

const Loader = ({
  message = "Loading...",
  size = "medium",
  fullScreen = false,
}: LoaderProps) => {
  return (
    <div
      className={`loader-container ${fullScreen ? "fullscreen" : ""}`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`loader loader-${size}`}
        aria-hidden="true"
      />

      <p className="loader-message">{message}</p>
    </div>
  );
};

export default Loader;
