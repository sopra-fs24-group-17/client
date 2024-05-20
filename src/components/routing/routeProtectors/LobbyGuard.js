import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import LobbyNew from "../../views/LobbyNew";

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
        <LobbyNew />
      </>
    );
  }
  return <Navigate to="/login" replace />;
};

LobbyGuard.propTypes = {
  children: PropTypes.node,
};
