import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export const Home = () => {
  const userLogged = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userLogged) {
      navigate("/todos", { replace: true });
    }
  }, [userLogged, navigate]);

  return (
    <main>
      <h1 className="animated-title d-flex justify-content-center align-items-center vh-100 text-center text-5xl">
        Welcome!
      </h1>
    </main>
  );
};
