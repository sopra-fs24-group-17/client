import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: "rgb(0, 0, 0)",
        },
        secondary: {
            main: "rgb(255, 255, 255)",
        },
    },
    typography: {
    },
    components: {
        MuiAlert: {
            styleOverrides: {
                root: {
                    marginTop: "1rem",
                    marginBottom: "1rem",
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    "&.Mui-selected": {
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                    },
                },
            },
        },
    },
});

export default theme;