import React from "react";

export default function Home() { //homepage message
      return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to <span style={{ color: "#6a1b9a" }}>BookMark</span>!</h1>
      <p style={{ fontSize: "1.2rem", marginTop: "1rem" }}>
        We're a <strong>novel</strong> way to explore your favorite reads, save them, and peek into what others are bookmarking too.
      </p>
      <p style={{ fontSize: "1rem", marginTop: "1rem" }}>
        Browse books, explore profiles, and log in to contribute your own! 
        Only admins can add new books, but anyone can discover them.
      </p>
      <p style={{ marginTop: "1rem", fontStyle: "italic" }}>Happy Bookmarking! 📚</p>
    </div>
  );
}

