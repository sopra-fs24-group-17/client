import { Grid, Paper, Box } from "@mui/material";
import React from "react";
import chickenImage from 'components/game/chicken.png';

// Use `chickenImage` in your code

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={12} md={6}>
        <img
          src={chickenImage}
          alt="description"
          style={{ width: "100%", height: "100vh", objectFit: "cover" }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Box
          display="flex"
          flexDirection={"column"}
          alignItems="center"
          justifyContent="center"
          height="100vh"
          padding={5}
          paddingBottom={0}
        >
          {children}
        </Box>
      </Grid>
    </Grid>
  );
};

export default Layout;
