import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserStatusContext } from "../../contexts/UserStatusContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const userStatus = useContext(UserStatusContext);

  if (!userStatus) {
    return <Navigate to="/signin" replace />;
  }

  if (userStatus.isInitializing) {
    return null;
  }

  if (!userStatus.isLoggedIn || !userStatus.currentUserId) {
    return <Navigate to="/signin" replace />;
  }

  // Render protected content
  return <>{children}</>;
};
