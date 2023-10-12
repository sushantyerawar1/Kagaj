import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage/homepage"
import Login from "./Authentication/Login"
import SignUp from "./Authentication/Signup"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} exact />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
