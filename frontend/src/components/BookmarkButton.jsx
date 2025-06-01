import React from "react";

function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch (e) {
    return null;
  }
}

export default function BookmarkButton({ bookId }) {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const handleBookmark = async () => {
    if (!token || !userId) {
      alert("You must be logged in to bookmark.");
      return;
    }
  
    console.log("Sending bookmark request as user ID:", userId);
  
    // fetch exsisting bookmarks for this user
    try {
      const checkRes = await fetch(`http://localhost:8080/api/bookmarks/user/${userId}`);
      const existingBookmarks = await checkRes.json();
      const alreadyBookmarked = existingBookmarks.some(b => b.book.id === bookId);
  
      if (alreadyBookmarked) {//prevents double BookMarking
        alert("You've already bookmarked this.");
        return;
      }
    } catch (err) {
      console.error("Error checking existing bookmarks:", err);
      alert("Error checking bookmarks.");
      return;
    }
  
    // proceed to add BookMark
    try {
      const res = await fetch("http://localhost:8080/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, //provides token to authenticate user allowing BookMark
        },
        body: JSON.stringify({
          user: { id: userId },
          book: { id: bookId },
        }),
      });
  
      if (res.ok) {//successful bookmark
        alert("Bookmarked!");
      } else {
        const msg = await res.text();
        alert("Failed to bookmark: " + msg);
      }
    } catch (err) {
      console.error("Bookmark error:", err);
      alert("Something went wrong");
    }
  };

  return <button onClick={handleBookmark}>Bookmark</button>;
}