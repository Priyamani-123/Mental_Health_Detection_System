import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChartCard from "../../components/ChartCard";

const History = () => {

  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {

    try {

      const res = await API.get("/general/history");
      setHistory(res.data);

    } catch (error) {
      console.error(error);
    }

  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (

    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-content">

        <Navbar />

        <h2>Health History</h2>

        <div className="charts-section">

          <ChartCard
            title="Mood History"
            endpoint="/general/charts/mood-history"
          />

          <ChartCard
            title="Stress History"
            endpoint="/general/charts/stress-history"
          />

        </div>

        <table>

          <thead>

            <tr>
              <th>Date</th>
              <th>Mood</th>
              <th>Stress</th>
              <th>Anxiety</th>
              <th>Score</th>
            </tr>

          </thead>

          <tbody>

            {history.map((h) => (

              <tr key={h.id}>

                <td>{h.date}</td>
                <td>{h.mood}</td>
                <td>{h.stress}</td>
                <td>{h.anxiety}</td>
                <td>{h.score}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
};

export default History;