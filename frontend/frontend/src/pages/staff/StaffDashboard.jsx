import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

// 🔥 GRAPH IMPORTS
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar,
  PieChart, Pie, Cell, Legend
} from "recharts";

export default function StaffDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const score = Number(localStorage.getItem("score"));
  const riskLS = localStorage.getItem("risk");

  const mlRisk = localStorage.getItem("ml_risk");
  const mlProb = Number(localStorage.getItem("ml_prob"));

  const history =
    JSON.parse(localStorage.getItem("history")) || [];

  // 📈 LINE DATA
  const chartData = history.map((item, index) => ({
    name: `Test ${index + 1}`,
    score: item.score
  }));

  // 📊 BAR DATA
  const barData = chartData;

  // 🍩 PIE DATA
  const riskData = [
    { name: "Severe", value: history.filter(h => h.risk === "severe").length },
    { name: "Moderate", value: history.filter(h => h.risk === "moderate").length },
    { name: "Mild", value: history.filter(h => h.risk === "mild").length }
  ];

  const COLORS = ["#ff4d4d", "#ffa500", "#4caf50"];

  // 📊 AVG
  const avgScore =
    history.length > 0
      ? (
          history.reduce((sum, h) => sum + h.score, 0) /
          history.length
        ).toFixed(2)
      : "-";

  // 📈 TREND
  let trend = "-";
  if (history.length >= 2) {
    const last = history[history.length - 1].score;
    const prev = history[history.length - 2].score;

    if (last > prev) trend = "Improving 📈";
    else if (last < prev) trend = "Decreasing 📉";
    else trend = "Stable ➖";
  }

  // 🧠 INSIGHT
  const insight =
    trend.includes("Improving")
      ? "Mental health improving 👍"
      : trend.includes("Decreasing")
      ? "Stress increasing ⚠️"
      : "Stable condition";

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "staff") {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/staff/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(res.data);
      } catch (err) {
        console.error("❌ ERROR:", err.response || err);
      }
    };

    fetchData();
  }, [navigate]);

  if (!data && !score) return <h2>Loading staff dashboard...</h2>;

  const finalRisk =
    data?.mental_health_summary?.risk_level || riskLS;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>

      <h3 style={{ color: "#555" }}>👩‍🏫 Staff Dashboard</h3>
      <h1>{data?.message || "Welcome Staff 👩‍🏫"}</h1>

      {/* ACTIONS */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/assessment")}>
          Take Assessment
        </button>

        <button onClick={() => navigate("/mood")} style={{ marginLeft: "10px" }}>
          Add Mood
        </button>
      </div>

      {/* PROFILE */}
      <div style={box}>
        <h2>👤 Profile</h2>
        <p><b>Name:</b> {data?.student_profile?.name}</p>
        <p><b>Email:</b> {data?.student_profile?.email}</p>
      </div>

      {/* 🧠 SUMMARY */}
      <div style={box}>
        <h2>🧠 Mental Health Summary</h2>

        <p>Total Assessments: {history.length || 0}</p>
        <p>Latest Score: {score || "N/A"}</p>

        <p>
          Risk Level: <b style={{ color: getColor(finalRisk) }}>{finalRisk}</b>
        </p>

        <p>
          🤖 AI Risk: <b style={{ color: getColor(mlRisk) }}>{mlRisk}</b>
        </p>

        <p>
          🔍 Confidence: <b>{mlProb ? `${(mlProb * 100).toFixed(2)}%` : "No Data"}</b>
        </p>

        {/* 🔥 CONFIDENCE BAR */}
        <div style={{ background: "#ddd", width: "100%", height: "10px" }}>
          <div
            style={{
              width: `${mlProb * 100}%`,
              background: "green",
              height: "10px"
            }}
          />
        </div>
      </div>

      {/* 📊 REPORT */}
      <div style={box}>
        <h2>📊 Report Summary</h2>
        <p>Average Score: {avgScore}</p>
        <p>Risk Trend: {trend}</p>
        <p><b>{insight}</b></p>
      </div>

      {/* 📈 LINE */}
      <div style={box}>
        <h2>📈 Score Trend</h2>
        <LineChart width={500} height={250} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#007bff" />
        </LineChart>
      </div>

      {/* 📊 BAR */}
      <div style={box}>
        <h2>📊 Score Comparison</h2>
        <BarChart width={500} height={250} data={barData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="score" fill="#ff7300" />
        </BarChart>
      </div>

      {/* 🍩 PIE */}
      <div style={box}>
        <h2>🍩 Risk Distribution</h2>
        <PieChart width={400} height={250}>
          <Pie data={riskData} dataKey="value" outerRadius={80} label>
            {riskData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </div>

    </div>
  );
}

// 🎨 COLORS
const getColor = (risk) => {
  if (!risk) return "black";
  if (risk === "severe") return "red";
  if (risk === "moderate") return "orange";
  return "green";
};

const box = {
  border: "1px solid #ccc",
  padding: "15px",
  marginBottom: "20px",
};