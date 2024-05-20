import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import Lobby from "../../views/Lobby";

/**
 * @Guard
 * @param props
 */
export const LobbyGuard = () => {
  const joinGame = localStorage.getItem("joinGame");
  const createflag = localStorage.getItem("createflag");
  const token = localStorage.getItem("token");
  if (token && (joinGame || createflag)) {
    return (
      <>
        <Lobby />
      </>
    );
  }
  return <Navigate to="/login" replace />;
};

LobbyGuard.propTypes = {
  children: PropTypes.node,
};
