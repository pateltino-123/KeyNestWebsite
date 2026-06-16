import React, { Component } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: unknown): State {
    const normalized: Error = error instanceof Error ? error : new Error(String(error ?? "Unknown error"));
    return { hasError: true, error: normalized };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    if (__DEV__) {
      const msg = error instanceof Error ? error.message : String(error ?? "");
      console.error("[ErrorBoundary] Caught:", msg);
      if (errorInfo.componentStack) {
        console.error("[ErrorBoundary] Stack:", errorInfo.componentStack.slice(0, 500));
      }
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            {this.state.error?.message || "An unexpected error occurred."}
          </Text>
          <Pressable style={styles.button} onPress={this.handleReset}>
            <Text style={styles.buttonText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0A0A0A",
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: "#A3A3A3",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
  },
  button: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
