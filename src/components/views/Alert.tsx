import * as React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";

export default function FilledAlert({pTurn, active}) {
  console.log(pTurn);
  const msgSev = pTurn ? "warning" : "info";
  const msg = pTurn ? "It's your turn! Play a card or draw from the deck to end your turn." : `Player ${active} is now playing`;
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert
        variant="filled"
        severity={msgSev}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        {msg}
      </Alert>
    </Stack>
  );
}

// Define prop types
FilledAlert.propTypes = {
  pTurn: PropTypes.bool.isRequired,
  active: PropTypes.string.isRequired,
};
