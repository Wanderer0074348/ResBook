"use client";

import { Component, ReactNode } from "react";
import { RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              An unexpected error occurred. Please try again.
            </p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 border border-black dark:border-white"
              >
                <RefreshCw className="w-4 h-4" />
                Try again
              </button>
              
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black"
              >
                <Home className="w-4 h-4" />
                Go home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}