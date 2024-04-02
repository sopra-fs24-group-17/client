import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * @Guard
 * @param props
 */
export const GameGuard = () => {
  if (localStorage.getItem("token")) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
};

GameGuard.propTypes = {
  children: PropTypes.node,
};
