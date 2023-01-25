import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./containers/Authentication/Login";
import Register from "./containers/Authentication/Register";
import Home from "./containers/Dashboard/Home";
import NonProtectedRoute from "./routes/nonProtectedRoutes";
import ProtectedRoute from "./routes/protectedRoutes";
import { useGlobal } from "./contexts/GlobalContext";

const App = () => {
  const { theme } = useGlobal();

  return (
      <div className="app" id={theme}>
        <Routes>
          <Route
            index
            path="/auth-login"
            element={<NonProtectedRoute component={<Login />} />}
          />
          <Route
            path="/auth-register"
            element={<NonProtectedRoute component={<Register />} />}
          />

          <Route path="/" element={<ProtectedRoute component={<Home />} />} />
        </Routes>
      </div>
  );
};

export default App;
