import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomeView from "./views/HomeView";
import LoginView from "./views/LoginView";
import UserProfileView from "./views/UserProfileView";
import bgImage from "./assets/bgImage.jpg";
import {Toaster} from "react-hot-toast"
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


const App = () => {

  const { authUser } = useContext(AuthContext);



  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Toaster/>
      <Routes>
        <Route path="/" element={authUser ? <HomeView /> : <Navigate to="/login"/>} />
        <Route path="/login" element={!authUser ? <LoginView /> : <Navigate to="/"/>} />
        <Route path="/userProfile" element={authUser ? <UserProfileView /> : <Navigate to="/login"/>} />
      </Routes>
    </div>
  );
};

export default App;
