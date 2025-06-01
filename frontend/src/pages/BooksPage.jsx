import React, { useState, useEffect } from "react";
import BookmarkButton from "../components/BookmarkButton";

const userId = localStorage.getItem("userId");

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Initial fetch
  useEffect(() => {
    fetch("http://localhost:8080/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data);
      })
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  // Dynamic filtering & sorting
  useEffect(() => {
    if (!filterCategory || keyword.trim() === "") {
      setFilteredBooks(books);
      return;
    }

    const lowerKeyword = keyword.toLowerCase();

    const filtered = books.filter((book) => {
      const value = book[filterCategory]?.toLowerCase() || "";
      return value.includes(lowerKeyword);
    });

    if (sortField) {
      filtered.sort((a, b) => {
        const aVal = a[sortField]?.toLowerCase() || "";
        const bVal = b[sortField]?.toLowerCase() || "";
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredBooks(filtered);
  }, [keyword, filterCategory, sortField, sortOrder, books]);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">All Books</h1>

      {/* Filter & Sort Controls */}
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
        {filteredBooks.map((book) => {
          console.log(book);
          return (
            <div key={book.id} className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <h6 className="card-subtitle text-muted">{book.author}</h6>
                  <p className="card-text">{book.description}</p>
                  <p className="card-text">
                    <strong>Genre:</strong> {book.genre || "N/A"}
                  </p>
                </div>
                <div className="card-footer">
                  <BookmarkButton bookId={book.id} />
                </div>
              </div>
            </div>
          );
        })}
        {filteredBooks.length === 0 && (
          <div className="text-muted mt-3">No books found.</div>
        )}
      </div>
    </div>
  );
}