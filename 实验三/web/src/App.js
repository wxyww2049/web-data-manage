import logo from "./logo.svg";
import "./App.css";
import { QueryClientProvider } from "@tanstack/react-query";
import Router from "./router/Router";
import { queryClient } from "./query/CustomQueryClient";

function App() {
  // const queryClient = new QueryClient();
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </div>
  );
}

export default App;
