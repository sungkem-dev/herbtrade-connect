import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ComplianceErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error("[ComplianceErrorBoundary] caught error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center gradient-bg p-6">
          <div className="glass-card border border-border/50 rounded-2xl p-8 max-w-md text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-gradient-hero">
              Compliance service unavailable
            </h2>
            <p className="text-sm text-muted-foreground">
              We couldn't sync the realtime compliance feed. You can retry, or reload the
              page. Your data is safe.
            </p>
            {this.state.error?.message && (
              <p className="text-xs font-mono text-muted-foreground/70 break-words">
                {this.state.error.message}
              </p>
            )}
            <div className="flex gap-3 justify-center pt-2">
              <Button variant="outline" onClick={this.handleReset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try again
              </Button>
              <Button onClick={this.handleReload}>Reload app</Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
