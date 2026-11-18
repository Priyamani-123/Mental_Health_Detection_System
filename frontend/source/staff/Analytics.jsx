import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChartCard from "../../components/ChartCard";

const Analytics = () => {

  const [stats, setStats] = useState(null);

  const fetchAnalytics = async () => {

    try {

      const res = await API.get("/staff/analytics");
      setStats(res.data);

    } catch (error) {
      console.error(error);
    }

  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (!stats) return null;

  return (

    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-content">

        <Navbar />

        <h2>Mental Health Analytics</h2>

        <div className="charts-section">

          <ChartCard
            title="Depression Analysis"
            endpoint="/staff/charts/depression"
          />

          <ChartCard
            title="Anxiety Analysis"
            endpoint="/staff/charts/anxiety"
          />

          <ChartCard
            title="Assessment Completion Rate"
            endpoint="/staff/charts/assessment"
          />

        </div>

      </div>

    </div>

  );
};

export default Analytics;