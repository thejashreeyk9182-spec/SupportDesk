
import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { logger } from "../../monitoring/logger";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error("Application rendering error", {
      errorName: error.name,
      errorMessage: error.message,
      componentStack: info.componentStack,
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="error-boundary">
          <h2>Something went wrong!</h2>

          <p>Unable to display this section.</p>

          <button onClick={this.handleRetry}>
            Try Again
          </button>

          <button onClick={this.handleReload}>
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
