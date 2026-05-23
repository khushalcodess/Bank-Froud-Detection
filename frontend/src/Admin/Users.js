import React, { useState, useEffect } from 'react';
import Ufilter from '../Components/Ufilter';
import Usertable from '../Components/Usertable';
import { getUsers } from '../api/admin';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data.users);
      setFiltered(res.data.users);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filter users
  const handleFilter = (filter) => {
    setActiveFilter(filter);
    setSearchQuery("");
    applyFilter(filter, "");
  };

  // ✅ Search users
  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilter(activeFilter, query);
  };

  // ✅ Apply both filter and search together
  const applyFilter = (filter, query) => {
    let result = users;

    // Apply status filter
    if (filter === "active") {
      result = result.filter(u => u.status === "active");
    } else if (filter === "blocked") {
      result = result.filter(u => u.status === "blocked");
    }

    // Apply search
    if (query) {
      result = result.filter(u =>
        u.name?.toLowerCase().includes(query.toLowerCase()) ||
        u.email?.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFiltered(result);
  };

  // ✅ Update user in list after block/unblock
  const handleUserUpdate = (userId, newStatus) => {
    const updated = users.map(u =>
      u._id === userId ? { ...u, status: newStatus } : u
    );
    setUsers(updated);
    applyFilter(activeFilter, searchQuery);

    // Re-apply filter with updated data
    let result = updated;
    if (activeFilter === "active") {
      result = result.filter(u => u.status === "active");
    } else if (activeFilter === "blocked") {
      result = result.filter(u => u.status === "blocked");
    }
    if (searchQuery) {
      result = result.filter(u =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFiltered(result);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}>
        <div className="text-center">
          <div className="spinner-border"
            style={{ color: "#0F3D3E", width: "50px", height: "50px" }}
            role="status"
          />
          <p className="mt-3" style={{ color: "#0F3D3E" }}>Loading Users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingBottom: "40px" }}>

      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 50px 10px"
      }}>
        <h2 style={{ color: "#0F3D3E", margin: 0 }}>Users</h2>
        <span style={{
          backgroundColor: "#e8f5f5",
          color: "#0F3D3E",
          padding: "4px 12px",
          borderRadius: "10px",
          fontSize: "13px"
        }}>
          {filtered.length} of {users.length} users
        </span>
      </div>

      {/* Stats Row */}
      <div style={{
        display: "flex",
        gap: "15px",
        padding: "10px 50px 20px"
      }}>
        <div style={{
          background: "white",
          padding: "15px 25px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          textAlign: "center",
          flex: 1
        }}>
          <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>Total Users</p>
          <h4 style={{ margin: "5px 0 0", color: "#0F3D3E" }}>{users.length}</h4>
        </div>
        <div style={{
          background: "white",
          padding: "15px 25px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          textAlign: "center",
          flex: 1
        }}>
          <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>Active</p>
          <h4 style={{ margin: "5px 0 0", color: "#28a745" }}>
            {users.filter(u => u.status === "active").length}
          </h4>
        </div>
        <div style={{
          background: "white",
          padding: "15px 25px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          textAlign: "center",
          flex: 1
        }}>
          <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>Blocked</p>
          <h4 style={{ margin: "5px 0 0", color: "#dc3545" }}>
            {users.filter(u => u.status === "blocked").length}
          </h4>
        </div>
      </div>

      {/* Filter + Search */}
      <Ufilter
        activeFilter={activeFilter}
        onFilter={handleFilter}
        searchQuery={searchQuery}
        onSearch={handleSearch}
      />

      {/* Table */}
      <div style={{ padding: "0 30px" }}>
        <Usertable
          users={filtered}
          onUpdate={handleUserUpdate}
        />
      </div>

    </div>
  );
};

export default Users;