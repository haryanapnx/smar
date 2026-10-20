import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Unhandled UI error', error, info);
  }

  private readonly handleReset = () => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    if (error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
          <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm dark:border-red-900/60 dark:bg-slate-900">
            <p className="text-lg font-semibold text-red-700 dark:text-red-300">
              Something went wrong
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{error.message}</p>
            <button
              type="button"
              onClick={this.handleReset}
              className="mt-4 rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-800"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
