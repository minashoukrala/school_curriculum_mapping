import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import CurriculumBuilder from "@/pages/curriculum-builder";
import NotFound from "@/pages/not-found";
import ErrorBoundary from "@/components/error-boundary";

function Router() {
  return (
    <Switch>
      <Route path="/" component={CurriculumBuilder} />
      <Route path="/curriculum" component={CurriculumBuilder} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
