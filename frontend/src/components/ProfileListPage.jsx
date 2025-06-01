import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ProfileListPage() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {//fetches which user to display on ProfilePage
    setLoading(true);
    fetch("http://localhost:8080/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mt-4">
      <h2>User Profiles</h2>

      {/* filter controls */}
      <div className="row mb-3">
        <div className="col-md-4">
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

      {/* Results */}
      <ul className="list-group">
        {users
          .filter((user) => {
            if (!filterCategory || !keyword.trim()) return true;

            const rawValue = user[filterCategory];

            const value = Array.isArray(rawValue)
              ? rawValue.join(", ").toLowerCase()
              : rawValue?.toLowerCase() || "";

            return value.includes(keyword.toLowerCase());
          })
          .map((user) => (
            <li key={user.id}>
              <Link to={`/profile/${user.id}`}>{user.username}</Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default ProfileListPage;