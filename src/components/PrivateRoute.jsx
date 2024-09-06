/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export const PrivateRoute = ({ children }) => {
  const user = useContext(UserContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
