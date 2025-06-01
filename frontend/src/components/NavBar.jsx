import React from "react";
import { Link } from "react-router-dom";

export default function NavBar({ isLoggedIn, isAdmin, userId, onLogout }) {
  return (
    <nav
      style={{
        display: "flex",
        gap: "1rem",
        padding: "1rem",
        backgroundColor: "#20232a",
        color: "white",
      }}
    >
      {/* app title, is always visible */}
      <Link to="/" style={{ color: "white", fontWeight: "bold" }}>
        BookMark
      </Link>

      {/* public and constantly visible routes */}
      <Link to="/books" style={{ color: "white" }}>All Books</Link>
      <Link to="/profiles" style={{ color: "white" }}>All Profiles</Link>

      {/* profile link appearing only if user is logged in */}
      {isLoggedIn && (
  <Link to={`/profile/${userId}`} style={{ color: "white" }}>
    Profile
  </Link>
)}

      {/* add Book visible only to admins */}
      {isAdmin && (
        <Link to="/add-book" style={{ color: "white" }}>Add Book</Link>
      )}

      {/* show Login or Logout depending on login state */}
      {!isLoggedIn ? (
        <Link to="/login" style={{ color: "white" }}>Login</Link>
      ) : (
        <button
          onClick={onLogout}
          style={{
            color: "white",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      )}
    </nav>
  );
}
