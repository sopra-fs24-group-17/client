import * as React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export default function FilledAlert() {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert
        variant="filled"
        severity="warning"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        It&apos;s your turn! Play a card or draw from the deck to end your turn.
      </Alert>
    </Stack>
  );
}
