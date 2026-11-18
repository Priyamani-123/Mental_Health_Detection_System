import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function Assessment() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await API.get("/assessment/questions");
        setQuestions(res.data);
      } catch (err) {
        console.error("❌ Questions error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleChange = (qId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: Number(value),
    }));
  };

  const allAnswered =
    questions.length > 0 &&
    questions.every((q) => answers[q.id] !== undefined);

  const handleSubmit = async () => {
    if (!allAnswered) {
      alert("Please answer all questions!");
      return;
    }

    setSubmitting(true);

    try {
      console.log("🚀 SUBMIT START");

      const formattedAnswers = questions.map((q) => ({
        question_id: q.id,
        answer_score: answers[q.id],
      }));

      // ✅ STEP 1: SAVE ASSESSMENT
      const res = await API.post("/assessment/submit", {
        answers: formattedAnswers,
      });

      const totalScore = res.data.total_score;
      const riskLevel = res.data.risk_level;

      localStorage.setItem("score", totalScore);
      localStorage.setItem("risk", riskLevel);

      console.log("✅ Score:", totalScore);

      // 🔥 STEP 2: PREPARE ML INPUT (VERY IMPORTANT)
      const values = Object.values(answers);

      const avgMood =
        values.reduce((sum, v) => sum + v, 0) / values.length;

      const variance =
        Math.max(...values) - Math.min(...values);

      const stress =
        totalScore > 30 ? 5 :
        totalScore > 20 ? 4 :
        totalScore > 10 ? 3 : 2;

      const sleep =
        totalScore > 30 ? 4 :
        totalScore > 20 ? 5 :
        totalScore > 10 ? 6 : 7;

      console.log("🧠 ML INPUT:", {
        totalScore,
        avgMood,
        variance,
        sleep,
        stress,
      });

      // 🔥 STEP 3: ML CALL (FINAL FIX)
      const token = localStorage.getItem("token");

      console.log("🔑 TOKEN:", token);

      let mlRisk = "Unknown";
      let mlProb = 0;

      try {
        const mlRes = await API.post(
          "/ml/predict-risk",
          {
            assessment_score: totalScore,
            avg_mood_score: avgMood,
            mood_variance: variance,
            sleep_hours: sleep,
            stress_level: stress,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("🤖 ML RESPONSE FULL:", mlRes);

        if (mlRes && mlRes.data) {
          mlRisk = mlRes.data.risk_level || "Unknown";
          mlProb = mlRes.data.probability || 0;
        }

      } catch (err) {
        console.error("❌ ML ERROR FULL:", err.response || err);
      }

      // 🔥 STEP 4: STORE (STRING FORMAT IMPORTANT)
      localStorage.setItem("ml_risk", String(mlRisk));
      localStorage.setItem("ml_prob", String(mlProb));

      console.log("💾 Stored ML:", mlRisk, mlProb);

      // 🔥 STEP 5: HISTORY
      const history =
        JSON.parse(localStorage.getItem("history")) || [];

      history.push({
        score: totalScore,
        risk: riskLevel,
        date: new Date().toISOString(),
      });

      localStorage.setItem("history", JSON.stringify(history));

      // 🔁 REDIRECT
      setTimeout(() => {
        const role = localStorage.getItem("role");

        if (role === "student") navigate("/student");
        else if (role === "staff") navigate("/staff");
        else if (role === "general") navigate("/general");
        else navigate("/");
      }, 300);

    } catch (err) {
      console.error("❌ Submit error:", err.response?.data || err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📝 Assessment</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        questions.map((q) => (
          <div key={q.id}>
            <p><b>{q.question}</b></p>

            {q.options.map((opt, i) => (
              <label key={i} style={{ marginRight: "10px" }}>
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={opt.score}
                  checked={answers[q.id] === opt.score}
                  onChange={(e) =>
                    handleChange(q.id, e.target.value)
                  }
                />
                {opt.text}
              </label>
            ))}
          </div>
        ))
      )}

      <button
        onClick={handleSubmit}
        disabled={!allAnswered || submitting}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: submitting ? "gray" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}