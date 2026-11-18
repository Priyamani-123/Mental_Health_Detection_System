import { useEffect, useState } from "react";
import API from "../../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const ChartCard = ({ title, endpoint }) => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {

    try {

      const res = await API.get(endpoint);
      setData(res.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  if (loading) return <p>Loading chart...</p>;

  return (

    <div className="chart-card">

      <h3>{title}</h3>

      <ResponsiveContainer width="100%" height={300}>

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );
};

export default ChartCard;