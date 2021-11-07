import { createBrowserHistory } from "history";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import theme from "theme";

const history = createBrowserHistory();

export default function AppProviders({ children }) {
  return (
    <ThemeProvider theme={theme(true)}>
      <BrowserRouter history={history}>{children}</BrowserRouter>
    </ThemeProvider>
  );
}
