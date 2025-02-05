import { BrowserRouter } from "react-router-dom";
import React from 'react';
import { Routes, Route,Navigate } from "react-router-dom";
import LandingPage from "./views/pages/landing-page/LandingPage.jsx";
import Login from "./views/pages/login/index.jsx";
import SignUp from "./views/pages/sign-up/index.jsx";
import HomePage from "./views/pages/home/index.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
            <Route path="/" element={<Navigate to="/landing" />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/home" element={<HomePage />} />
     </Routes>
     </BrowserRouter>
 );
}

export default App;