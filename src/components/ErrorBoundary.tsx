"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Optional custom fallback UI. Defaults to a generic error card. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message ?? "Unknown error" };
  }

  handleReset = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-7 h-7 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Something went wrong
            </h2>
            <p className="text-sm text-slate-600">
              An unexpected error occurred. Please try again or refresh the
              page.
            </p>
            {process.env.NODE_ENV === "development" && (
              <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 font-mono text-left break-words">
                {this.state.message}
              </p>
            )}
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
