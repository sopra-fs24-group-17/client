import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * @Guard
 * @param props
 */
export const ProfileGuard = () => {
  if (localStorage.getItem("token")) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
};

ProfileGuard.propTypes = {
  children: PropTypes.node,
};
