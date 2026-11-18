import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChartCard from "../../components/ChartCard";

const StaffDashboard = () => {

  const [summary, setSummary] = useState(null);

  const fetchSummary = async () => {

    try {

      const res = await API.get("/Staff/dashboard/summary");
      setSummary(res.data);

    } catch (error) {
      console.error(error);
    }

  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (!summary) return null;

  return (

    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-content">

        <Navbar />

        <h2>Staff Monitoring Dashboard</h2>

        <div className="dashboard-cards">

          <div className="card">
            <h3>Total Students</h3>
            <p>{summary.total_students}</p>
          </div>

          <div className="card">
            <h3>High Risk Students</h3>
            <p>{summary.high_risk}</p>
          </div>

          <div className="card">
            <h3>Assessments Completed</h3>
            <p>{summary.assessments_completed}</p>
          </div>

        </div>

        <div className="charts-section">

          <ChartCard
            title="Stress Level Trend"
            endpoint="/staff/charts/stress"
          />

          <ChartCard
            title="Mood Distribution"
            endpoint="/staff/charts/mood"
          />

        </div>

      </div>

    </div>

  );
};

export default StaffDashboard;