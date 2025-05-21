import React, { useEffect, useState } from "react";

// Dummy API: https://jsonplaceholder.typicode.com/users

const User = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  // Fetch users from API
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("API Error:", err));
  }, []);

  // Debounce search (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Filtered and Sorted Users
  const filteredUsers = users
    .filter((user) =>
      user.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
    .sort((a, b) => b.id - a.id);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>User Directory</h2>

      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: 6, marginBottom: 10, width: "200px" }}
      />

      <button
        onClick={() => setSortAsc((prev) => !prev)}
        style={{ marginLeft: 10, padding: "6px 10px" }}
      >
        Sort: {sortAsc ? "A → Z" : "Z → A"}
      </button>

      <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: 20 }}>
        {filteredUsers.map((user) => (
          <li
            key={user.id}
            style={{
              marginBottom: 10,
              padding: 10,
              border: "1px solid #ddd",
              borderRadius: 5,
            }}
          >
            <strong>{user.name}</strong> <br />
            <small>{user.email}</small> <br />
            <small>{user.phone}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default User;
