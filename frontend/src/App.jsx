import {useState, useEffect} from 'react';
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import BooksPage from "./pages/BooksPage.jsx";
import NavBar from "./components/NavBar";
import ProfileListPage from "./components/ProfileListPage.jsx";
import BookForm from "./pages/BookForm.jsx";
import LoginPage from "./pages/LoginPage.jsx";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userId, setUserId] = useState(null)

  //check login state from localStorage
  useEffect (() => {
    checkLoginState();;
  }, []);

  //handling logout
  function handleLogout() {
    localStorage.clear()
    setIsLoggedIn(false)
    setIsAdmin(false)
    setUserId(null)
  }

  function checkLoginState() {
    const token = localStorage.getItem("token");
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");
    const storedUserId = localStorage.getItem("userId");
  
    setIsLoggedIn(!!token);
    setIsAdmin(roles.includes("ROLE_ADMIN"));
    setUserId(storedUserId);
  }
  

  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn} isAdmin={isAdmin} userId={userId} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/profiles" element={<ProfileListPage />} />
        <Route path="/add-book" element={<BookForm />} />
          <Route path="/login" element={<LoginPage onLogin={checkLoginState} />} />

      </Routes>
    </div>
  );
}//other routes

