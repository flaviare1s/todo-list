import { useContext } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
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
    <header className="w-screen header">
      <Navbar variant="dark" expand="sm" className="px-3">
        <Container fluid>
          <Link className="text-xl font-bold" to="/">
            TODO LIST
          </Link>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto flex items-center">
              {user && (
                <span className="text-gray-400 cursor-default mr-2">
                  Hi, {user.displayName}!
                </span>
              )}
              {user && (
                <Link className="nav-link" to="todos">
                  Todos
                </Link>
              )}
              {user && (
                <Link className="nav-link" to="mytodos">
                  My Todos
                </Link>
              )}
              {user && (
                <Link className="nav-link" to="lists">
                  Lists
                </Link>
              )}
              {!user && (
                <Link className="nav-link" to="register">
                  Register
                </Link>
              )}
              {!user && (
                <Link className="nav-link" to="login">
                  Login
                </Link>
              )}
              {user && (
                <button
                  className="block logout hover:text-light ml-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};
