import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar,
  PieChart, Pie, Cell, Legend
} from "recharts";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [moods, setMoods] = useState([]);

  const score = Number(localStorage.getItem("score"));
  const riskLS = localStorage.getItem("risk");

  const mlRisk = localStorage.getItem("ml_risk");
  const mlProb = Number(localStorage.getItem("ml_prob"));

  const history =
    JSON.parse(localStorage.getItem("history")) || [];

  const chartData = history.map((item, index) => ({
    name: `Test ${index + 1}`,
    score: item.score
  }));

  const riskData = [
    { name: "Severe", value: history.filter(h => h.risk === "severe").length },
    { name: "Moderate", value: history.filter(h => h.risk === "moderate").length },
    { name: "Mild", value: history.filter(h => h.risk === "mild").length }
  ];

  const COLORS = ["#ff4d4d", "#ffa500", "#4caf50"];

  const totalAssessments =
    data?.mental_health_summary?.total_assessments ||
    history.length ||
    (score ? 1 : 0);

  const avgScore =
    history.length > 0
      ? (
          history.reduce((sum, h) => sum + h.score, 0) /
          history.length
        ).toFixed(2)
      : score || "-";

  let trend = "-";
  if (history.length >= 2) {
    const last = history[history.length - 1].score;
    const prev = history[history.length - 2].score;

    if (last > prev) trend = "Improving 📈";
    else if (last < prev) trend = "Decreasing 📉";
    else trend = "Stable ➖";
  }

  const insight =
    trend.includes("Improving")
      ? "Your mental health is improving 👍"
      : trend.includes("Decreasing")
      ? "Stress increasing ⚠️"
      : "Stable condition";

  const apiRisk = data?.mental_health_summary?.risk_level;

  const finalRisk =
    apiRisk && apiRisk !== "Not Assessed"
      ? apiRisk
      : riskLS;

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "student") {
      navigate("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/student/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(res.data);
      } catch (err) {
        console.error("Dashboard ERROR:", err);
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (!data && !score) return <h2>Loading dashboard...</h2>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>

      <h3 style={{ color: "#555" }}>🎓 Student Dashboard</h3>
      <h1>{data?.message || "Welcome Student 👋"}</h1>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/assessment")}>
          Take Assessment
        </button>

        <button onClick={() => navigate("/mood")} style={{ marginLeft: "10px" }}>
          Add Mood
        </button>
      </div>

      {/* SUMMARY */}
      <div style={box}>
        <h2>🧠 Mental Health Summary</h2>

        <p>Total Assessments: {totalAssessments}</p>
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

      {/* REPORT */}
      <div style={box}>
        <h2>📊 Report Summary</h2>
        <p>Average Score: {avgScore}</p>
        <p>Risk Trend: {trend}</p>
        <p><b>{insight}</b></p>
      </div>

      {/* LINE */}
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

      {/* BAR */}
      <div style={box}>
        <h2>📊 Score Comparison</h2>
        <BarChart width={500} height={250} data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="score" fill="#ff7300" />
        </BarChart>
      </div>

      {/* 🔥 COMPARISON CARDS */}
      <div style={box}>
        <h2>📊 Assessment Comparison</h2>

        {history.length >= 2 ? (
          <div style={{ display: "flex", gap: "20px" }}>
            {history.slice(-3).map((h, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  width: "120px",
                  textAlign: "center",
                  borderRadius: "10px",
                  background: "#f9f9f9"
                }}
              >
                <h4>Test {history.length - 2 + i}</h4>

                <p>Score: <b>{h.score}</b></p>

                <p>
                  Risk:{" "}
                  <span style={{ color: getColor(h.risk) }}>
                    {h.risk}
                  </span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>Take at least 2 assessments to compare</p>
        )}
      </div>

      {/* PIE */}
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

// COLORS
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