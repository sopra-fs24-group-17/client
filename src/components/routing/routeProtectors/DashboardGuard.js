import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import Dashboard from "../../ui/Dashboard";

/**
 * @Guard
 * @param props
 */
export const DashboardGuard = () => {
  if (localStorage.getItem("token")) {
    return (
      <>
        <Dashboard />
      </>
    );
  }

  return <Navigate to="/login" replace />;
};

DashboardGuard.propTypes = {
  children: PropTypes.node,
};
