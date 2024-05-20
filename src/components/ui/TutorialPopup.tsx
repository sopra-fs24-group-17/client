import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { api } from "helpers/api";

// Define an interface for the component props
interface TutorialPopupProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

const TutorialPopup: React.FC<TutorialPopupProps> = ({
  open,
  message,
  onClose,
}) => {
  const navigate = useNavigate();

  enum TutorialFlag {
    TRUE,
    FALSE,
  }

  const handleClick = async () => {
    interface UpdateData {
      tutorialflag?: TutorialFlag;
    }
    const updateData: UpdateData = { tutorialflag: TutorialFlag.FALSE };
    await api.put(
      `dashboard/${localStorage.getItem("id")}/profile`,
      JSON.stringify(updateData),
      {
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
      }
    );

    navigate("/dashboard/tutorial");
  };

  const handleDontShowAgain = async () => {
    interface UpdateData {
      tutorialflag?: TutorialFlag;
    }
    const updateData: UpdateData = { tutorialflag: TutorialFlag.FALSE };
    await api.put(
      `dashboard/${localStorage.getItem("id")}/profile`,
      JSON.stringify(updateData),
      {
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
      }
    );
    onClose();
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClick}>
        Begin Tutorial
      </Button>
      <Button color="secondary" size="small" onClick={handleDontShowAgain}>
        Don&apos;t Show Again
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={onClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      message={message}
      action={action}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    />
  );
};

export default TutorialPopup;
