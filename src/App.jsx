import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Footer } from "./components/Footer";
import { Todos } from "./pages/Todos";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { Register } from "./pages/Register";
import { ResetPassword } from "./pages/ResetPassword";
import { Toaster } from "react-hot-toast";
import { UserContext } from "./contexts/UserContext";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Loader } from "./components/Loader";
import { auth } from "./firebase/config";
import { PrivateRoute } from "./components/PrivateRoute";

export function App() {
  const [userLogged, setUserLogged] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUserLogged(user);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <Loader />;

  return (
    <UserContext.Provider value={userLogged}>
      <main className="flex flex-col min-h-screen">
        <BrowserRouter>
          <Header />
          <section className="grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/todos" element={<PrivateRoute><Todos /></PrivateRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </section>
          <Footer />
        </BrowserRouter>
        <Toaster position="top-center" />
      </main>
    </UserContext.Provider>
  );
}
