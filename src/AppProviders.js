import { createBrowserHistory } from "history";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import theme from "theme";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();
const history = createBrowserHistory();

export default function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme(true)}>
        <BrowserRouter history={history}>{children}</BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
