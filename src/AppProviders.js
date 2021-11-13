import { createBrowserHistory } from "history";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import theme from "theme";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import GlobalStyle from "styles/globalStyle";

const queryClient = new QueryClient();
const history = createBrowserHistory();

export default function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="bottom-center" />
      <ThemeProvider theme={theme(true)}>
        <GlobalStyle />
        <BrowserRouter history={history}>{children}</BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
