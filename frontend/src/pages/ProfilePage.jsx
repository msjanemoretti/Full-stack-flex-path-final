import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProfilePage() {
    const { userId } = useParams();
    const [bookmarks, setBookmarks] = useState([]);
    const [error, setError] = useState('');
    const token = localStorage.getItem("token");
    const [username, setUsername] = useState("");

    
    
    // fetch username once on mount
    useEffect(() => {
        fetch(`http://localhost:8080/api/users/${userId}`)
            .then((res) => {
                console.log("User fetch status:", res.status);
                return res.json();
            })
            .then((data) => {
                console.log("Fetched user data:", data);
                setUsername(data.username);
            })
            .catch((err) => {
                console.error("Error loading user:", err);
                setError("Could not load user info.");
            });
    }, [userId]);

    // fetches bookmarks for user logged in
    useEffect(() => {
        fetch(`http://localhost:8080/api/bookmarks/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
            .then((res) => res.json())
            .then((data) => setBookmarks(data))
            .catch((err) => {
                console.error("Error fetching bookmarks:", err);
                setError("Could not load bookmarks.");
            });
    }, [userId]);



    if (!token) {
        return <p>Please log in to view this profile.</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return ( //bookmark display
        <div className="container mt-4">
        <h1>
          {username ? `${username}'s Bookmarks` : 'Loading user...'}
        </h1>
        <div className="row">
          {bookmarks.map((bookmark) => (
            <div className="col-md-4 mb-4" key={bookmark.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{bookmark.book.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{bookmark.book.author}</h6>
                  <p className="card-text">
                    {bookmark.book.description || "No description available."}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>  
    )}