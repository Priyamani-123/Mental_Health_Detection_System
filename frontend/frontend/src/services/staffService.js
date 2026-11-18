import API from "../api/axios";

export const getStaffSummary = async () => {
  try {
    const res = await API.get("/staff/dashboard/summary");
    return res.data;
  } catch (error) {
    throw error.response?.data ||{
      message: "Failed to fetch staff summary."
    };
  }
};

export const getStaffAnalytics = async () => {
  try {
    const res = await API.get("/staff/analytics");
    return res.data;
  } catch (error) {
    throw error.response?.data ||{
      message: "Failed to fetch staff analytics."
    };
  }
};

export const getStaffAlerts = async () => {
  try {
    const res = await API.get("/staff/alerts");
    return res.data;
  } catch (error) {
    throw error.response?.data ||{
      message: "Failed to fetch staff alerts."
    };
  }
};