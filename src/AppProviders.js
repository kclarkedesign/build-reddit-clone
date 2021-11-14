import { createBrowserHistory } from "history";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import theme from "theme";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import GlobalStyle from "styles/globalStyle";
import useStore from "store";

const queryClient = new QueryClient();
const history = createBrowserHistory();

export default function AppProviders({ children }) {
  const isDarkTheme = useStore((s) => s.isDarkTheme);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="bottom-center" />
      <ThemeProvider theme={theme(isDarkTheme)}>
        <GlobalStyle />
        <BrowserRouter history={history}>{children}</BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
