import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Optional label so a boundary around one unit doesn't blank the whole app. */
  resetKey?: string;
}

interface State {
  error: Error | null;
}

/**
 * Catches render errors so a single bad section/unit doesn't white-screen the app.
 * When `resetKey` changes (e.g. navigating to another unit) the boundary recovers.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidUpdate(prev: Props) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface in console for debugging; never fail silently.
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="max-w-xl mx-auto my-12 card p-6 text-center" role="alert">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1.5">
            משהו השתבש בטעינת התוכן
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            אירעה שגיאה בלתי-צפויה. אפשר לרענן את העמוד או לחזור לדף הבית.
          </p>
          <button
            onClick={() => {
              window.history.pushState({}, "", "/");
              this.setState({ error: null });
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
          >
            חזרה לדף הבית
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
