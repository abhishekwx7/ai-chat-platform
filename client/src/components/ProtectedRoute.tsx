import { Navigate, Outlet } from "react-router-dom";
import { authClient } from "../auth-client";

function ProtectedRoute() {
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#191C22] text-white">
        <p className="text-gray-400">Checking session...</p>
      </div>
    );
  }

  if (error || !session) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
