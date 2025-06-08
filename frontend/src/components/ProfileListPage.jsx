import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ProfileListPage() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">User Profiles</h2>

      {/* Filter controls */}
      <div className="row mb-2">
        <div className="col-md-6">
          <label className="form-label">Filter by</label>
          <select
            className="form-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Select</option>
            <option value="username">Username</option>
            <option value="roles">Roles</option>
          </select>
        </div>

        <div className="col-md-6">
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

      {/* Sort controls */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label">Sort by</label>
          <select
            className="form-select"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="">None</option>
            <option value="username">Username</option>
            <option value="roles">Roles</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Order</label>
          <select
            className="form-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            disabled={!sortField}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* User cards */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {users
            .filter((user) => {
              if (!filterCategory || !keyword.trim()) return true;
              const rawValue = user[filterCategory];
              const value = Array.isArray(rawValue)
                ? rawValue.join(", ").toLowerCase()
                : rawValue?.toLowerCase() || "";
              return value.includes(keyword.toLowerCase());
            })
            .sort((a, b) => {
              if (!sortField) return 0;

              const aVal = Array.isArray(a[sortField])
                ? a[sortField].join(", ").toLowerCase()
                : (a[sortField] || "").toLowerCase();

              const bVal = Array.isArray(b[sortField])
                ? b[sortField].join(", ").toLowerCase()
                : (b[sortField] || "").toLowerCase();

              if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
              if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
              return 0;
            })
            .map((user) => (
              <div className="col-md-4 mb-4" key={user.id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{user.username}</h5>
                    <p className="card-text">
                      <strong>Role:</strong>{" "}
                      {Array.isArray(user.roles)
                        ? user.roles.join(", ")
                        : user.role}
                    </p>
                    <Link to={`/profile/${user.id}`} className="btn btn-primary mt-auto">
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default ProfileListPage;