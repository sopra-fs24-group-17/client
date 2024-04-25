import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import Lobby from "../../views/Lobby";

/**
 * @Guard
 * @param props
 */
export const LobbyGuard = () => {
  if (localStorage.getItem("token")) {
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