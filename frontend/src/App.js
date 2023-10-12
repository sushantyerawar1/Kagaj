import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage/homepage"
import Login from "./Authentication/Login"
import SignUp from "./Authentication/Signup"
import ResetPassword from "./Authentication/Resetpassword"
import RequestPage from "./pages/RequestPage/RequestPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} exact />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/requests" element={<RequestPage />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
