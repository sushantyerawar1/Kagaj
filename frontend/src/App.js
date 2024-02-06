import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from './pages/HomePage/homepage';
import Login from './Authentication/Login';
import SignUp from './Authentication/Signup';
import RequestPage from './pages/RequestPage/RequestPage';
import SearchByUserPage from './pages/Search_By_User_Page/Search_By_User_Page';
import SearchByPlacePage from './pages/Search_by_palce_page/Search_By_Place_Page';
import IssuePage from './pages/Issue/IssuePage';
import ResetPassword from './Authentication/Resetpassword';
import Verified from "./Authentication/Verified"
import VerifiedMail from './Authentication/VerifyMail';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Homepage />} exact />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/requests" element={<RequestPage />} />
        <Route path="/search_by_user" element={<SearchByUserPage />} />
        <Route path="/search_by_place" element={<SearchByPlacePage />} />
        <Route path="/issue" element={<IssuePage />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
        <Route path="/verify/:id" element={<Verified />} />
        <Route path="/verifymail" element={<VerifiedMail />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
