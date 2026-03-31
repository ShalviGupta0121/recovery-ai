import { Component } from "react";

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error("RecoverAI render error", error);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="flex min-h-screen items-center justify-center px-6">
          <div className="glass-panel max-w-2xl p-8 text-center">
            <p className="text-lg font-semibold text-critical">RecoverAI hit a render error</p>
            <p className="mt-3 text-slate-300">{this.state.error.message}</p>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
