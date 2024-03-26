import React from "react";
import { createRoot } from "react-dom/client";
import { createTheme, MantineProvider } from '@mantine/core';
import App from "./App";


const theme = createTheme({
    fontFamily: 'Montserrat, sans-serif',
    defaultRadius: 'md',
});

const container = document.getElementById("app");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
    <React.StrictMode>
        <MantineProvider theme={theme}>
            <App tab="home" />
        </MantineProvider>
    </React.StrictMode>
);
