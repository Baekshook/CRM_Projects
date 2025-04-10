// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("에러 경계 캐치:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="error-container">
            <h2>문제가 발생했습니다</h2>
            <p>서버 연결에 문제가 있습니다. 잠시 후 다시 시도해 주세요.</p>
            <button onClick={() => window.location.reload()}>새로고침</button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
