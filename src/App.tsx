import React from "react";
import AppRouter from "./components/routing/routers/AppRouter";
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from "./styles/Theme";


/**
 * Happy coding!
 * React Template  by Lucas Pelloni
 * Overhauled by Kyrill Hux
 * Updated by Marco Leder
 */
const App = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRouter />
      </ThemeProvider>
    </>
  );
};

export default App;
