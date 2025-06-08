import React, { useState, useEffect } from "react";
import BookmarkButton from "../components/BookmarkButton";

export default function BooksPage() {
  // user info
  const userId = localStorage.getItem("userId");
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  const isAdmin = roles.includes("ROLE_ADMIN");

  // log JWT payload and roles
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("JWT Payload:", payload);
      console.log("Roles:", roles);
    }
  }, []);

  // states
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // fetch books
  useEffect(() => {
    fetch("http://localhost:8080/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data);
      })
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  // filter and sort
  useEffect(() => {
    let result = [...books];

    if (filterCategory && keyword.trim() !== "") {
      const lowerKeyword = keyword.toLowerCase();
      result = result.filter((book) => {
        const value = book[filterCategory]?.toLowerCase() || "";
        return value.includes(lowerKeyword);
      });
    }

    if (sortField) {
      result.sort((a, b) => {
        const aVal = a[sortField]?.toLowerCase() || "";
        const bVal = b[sortField]?.toLowerCase() || "";
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
    }

    setFilteredBooks(result);
  }, [keyword, filterCategory, sortField, sortOrder, books]);

  // delete book handler
  const handleDelete = (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      fetch(`http://localhost:8080/books/${bookId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to delete book.");
          setBooks((prev) => prev.filter((book) => book.id !== bookId));
        })
        .catch((err) => alert(err.message));
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">All Books</h1>

      {/* Filter Controls */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">Filter by</label>
          <select
            className="form-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Select</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="genre">Genre</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Keyword</label>
          <input
            type="text"
            className="form-control"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            disabled={!filterCategory}
          />
        </div>
      </div>

      {/* Sort Controls */}
      <div className="row mb-4">
        <div className="col-md-3">
          <label className="form-label">Sort by</label>
          <select
            className="form-select"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="">Select Field</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="genre">Genre</option>
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Order</label>
          <select
            className="form-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Book Cards */}
      <div className="row">
        {filteredBooks.map((book) => (
          <div key={book.id} className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{book.title || "Untitled"}</h5>
                <h6 className="card-subtitle text-muted">{book.author || "Unknown Author"}</h6>
                <p className="card-text">{book.description || "No description available."}</p>
                <p className="card-text">
                  <strong>Genre:</strong> {book.genre || "N/A"}
                </p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <BookmarkButton bookId={book.id} />
                {isAdmin && (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredBooks.length === 0 && (
          <div className="text-muted mt-3">No books found.</div>
        )}
      </div>
    </div>
  );
}