import React from 'react';

interface State {
  hasError: boolean;
  error?: Error | null;
  errorInfo?: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console for dev
    // In production you might send this to an error reporting service
    // eslint-disable-next-line no-console
    console.error('Uncaught error in React tree:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 text-red-900 min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="mb-4">A runtime error occurred while rendering the app. See console for full details.</p>
          {this.state.error && (
            <pre className="whitespace-pre-wrap text-sm bg-white p-4 rounded shadow-inner border border-red-100 overflow-auto">
              {this.state.error.toString()}
              {this.state.errorInfo ? '\n\n' + this.state.errorInfo.componentStack : ''}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
