import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChartCard from "../../components/ChartCard";

const StudentDashboard = () => {

  const [profile, setProfile] = useState(null);
  const [moodStats, setMoodStats] = useState([]);
  const [assessmentStatus, setAssessmentStatus] = useState(null);
  const [report, setReport] = useState(null);

  const fetchDashboardData = async () => {
    try {

      const profileRes = await API.get("/student/profile");
      setProfile(profileRes.data);

      const moodRes = await API.get("/student/mood/stats");
      setMoodStats(moodRes.data);

      const assessmentRes = await API.get("/student/assessment/status");
      setAssessmentStatus(assessmentRes.data);

      const reportRes = await API.get("/student/report/latest");
      setReport(reportRes.data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!profile) return null;

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-content">

        <Navbar />

        <div className="dashboard-header">

          <h2>Welcome {profile.name}</h2>
          <p>Mental Health Monitoring Dashboard</p>

        </div>

        <div className="dashboard-cards">

          <div className="card">

            <h3>Latest Mood</h3>
            <p>{profile.latest_mood}</p>

          </div>

          <div className="card">

            <h3>Assessment Status</h3>
            <p>{assessmentStatus?.status}</p>

          </div>

          <div className="card">

            <h3>Mental Health Score</h3>
            <p>{report?.mental_health_score}</p>

          </div>

        </div>

        <div className="charts-section">

          <ChartCard
            title="Mood Trend"
            endpoint="/student/mood/chart"
          />

          <ChartCard
            title="Assessment Progress"
            endpoint="/student/assessment/chart"
          />

        </div>

        <div className="report-section">

          <h3>Latest Report</h3>

          <div className="report-card">

            <p>
              Stress Level: {report?.stress_level}
            </p>

            <p>
              Anxiety Level: {report?.anxiety_level}
            </p>

            <p>
              Depression Level: {report?.depression_level}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;