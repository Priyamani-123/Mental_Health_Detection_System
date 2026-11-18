import React, { useEffect, useState } from "react";
import API from "../../api/axios";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/admin/dashboard")
      .then(res => {
        console.log("ADMIN DATA:", res.data);
        setData(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  if (!data) return <h2>Loading admin dashboard...</h2>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>

      {/* 👑 Welcome */}
      <h1>{data?.message || "Welcome Admin 👑"}</h1>

      {/* 📊 Stats */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>

        <div style={cardStyle}>
          <h3>Total Users</h3>
          <p>{data?.statistics?.total_users}</p>
        </div>

        <div style={cardStyle}>
          <h3>Students</h3>
          <p>{data?.statistics?.students}</p>
        </div>

        <div style={cardStyle}>
          <h3>Staff</h3>
          <p>{data?.statistics?.staff}</p>
        </div>

        <div style={cardStyle}>
          <h3>General</h3>
          <p>{data?.statistics?.general}</p>
        </div>

        <div style={{ ...cardStyle, background: "#ffe6e6" }}>
          <h3>High Risk</h3>
          <p>{data?.statistics?.high_risk_count}</p>
        </div>

      </div>

      {/* 🚨 High Risk Users */}
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "red" }}>🚨 High Risk Users</h2>

        {data?.high_risk_users?.length === 0 ? (
          <p>No high risk users</p>
        ) : (
          <table border="1" cellPadding="10" width="100%">
            <thead style={{ background: "#f2f2f2" }}>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Risk</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {data.high_risk_users.map((u, i) => (
                <tr key={i}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td style={{ color: "red" }}>{u.risk}</td>
                  <td>{u.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 👥 All Users */}
      <div>
        <h2>👥 All Users</h2>

        {data?.all_users?.length === 0 ? (
          <p>No users found</p>
        ) : (
          <table border="1" cellPadding="10" width="100%">
            <thead style={{ background: "#f2f2f2" }}>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.all_users.map((u, i) => (
                <tr key={i}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    {u.active ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

// 🎨 style
const cardStyle = {
  flex: 1,
  padding: "15px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  textAlign: "center",
  background: "#f9f9f9"
};