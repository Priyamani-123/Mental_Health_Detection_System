import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function Mood() {
  const navigate = useNavigate();

  const [score, setScore] = useState(3);
  const [note, setNote] = useState("");

  const getLabel = (score) => {
    if (score <= 2) return "Sad";
    if (score == 3) return "Neutral";
    return "Happy";
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/mood/",
        {
          mood_score: Number(score), // ✅ fix
          mood_label: getLabel(score),
          notes: note
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ IMPORTANT
          },
        }
      );

      // 🔥 OPTIONAL (instant UI update)
      localStorage.setItem("mood", getLabel(score));
      localStorage.setItem("moodScore", score);

      alert("Mood saved successfully ✅");

      // 🔥 redirect to dashboard
      navigate("/student");

    } catch (err) {
      console.log("Mood error:", err.response || err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Log Mood</h2>

      <input
        type="range"
        min="1"
        max="5"
        value={score}
        onChange={(e) => setScore(e.target.value)}
      />

      <p>Score: {score}</p>

      <textarea
        placeholder="Notes"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />

      <button onClick={handleSubmit}>Save Mood</button>
    </div>
  );
}