import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage/homepage"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} exact />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
