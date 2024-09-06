import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { logout } from "../firebase/auth";

export const Header = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout().then(() => {
      navigate("/login");
    });
  }

  return (
    <header className="w-screen bg-dark-gray">
      <div className="p-3 flex items-center justify-between">
        <Link className="text-xl font-bold" to="/">
          TODO LIST
        </Link>
        <nav className="flex gap-3 items-center">
          {user && (
            <span className="text-gray-400">Hi, {user.displayName}!</span>
          )}
          {user && (
            <Link className="hover:text-gray-500" to="todos">
              Todos
            </Link>
          )}
          {!user && (
            <Link className="hover:text-gray-500" to="register">
              Register
            </Link>
          )}
          {!user && (
            <Link className="hover:text-gray-500" to="login">
              Login
            </Link>
          )}
          {user && (
            <button
              className="block hover:text-gray-500"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
