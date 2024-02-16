import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";

const App = () => {
  return (
    <div className="container">
      <Routes>
        <Route exact path="/Chat" element={<Home />} />
        <Route exact path="/404" element={<ErrorPage />} />
        <Route exact path="/Login" element={<Login />} />
        <Route exact path="/" element={<Navigate to="/Chat" replace />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </div>
  );
};

export default App;
