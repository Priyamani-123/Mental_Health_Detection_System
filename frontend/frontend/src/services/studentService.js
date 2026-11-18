import API from "../api/axios";

export const getStudentProfile = async () => {
  try {
    const res = await API.get("/student/profile");
    return res.data;
  } catch (error) {
    throw error.response?.data ||{
      message: "Failed to fetch student profile."
    };
  }
};

export const getMoodStats = async () => {
  try {
    const res = await API.get("/student/mood/stats");
    return res.data;
  } catch (error) {
    throw error.response?.data ||{
      message: "Failed to fetch mood stats."
    };
  }
};

export const getAssessmentStatus = async () => {
  try {
    const res = await API.get("/student/assessment/status");
    return res.data;
  } catch (error) {
    throw error.response?.data ||{
      message: "Failed to fetch assessment status."
    };
  }
};

export const getLatestReport = async () => {
  try {
    const res = await API.get("/student/report/latest");
    return res.data;
  } catch (error) {
    throw error.response?.data ||{
      message: "Failed to fetch latest report."
    };
  }
};

export const submitAssessment = async (data) => {
  try {
    const res = await API.post("/assessment/submit", data);
    return res.data;
  } catch (error) {
    throw error.response?.data ||{
      message: "Failed to submit assessment."
    };
  }
};

export const logMood = async (data) => {
  try {
    const res = await API.post("/mood/log", data);
    return res.data;
  } catch (error) {
    throw error.response?.data ||{
      message: "Failed to log mood."
    };
  }
};

export const getStudentReport = async () => {
  try {
    const res = await API.get("/report/student");
    return res.data;
  } catch (error) {
    throw error.response?.data ||{
      message: "Failed to fetch student report."
    };
  }
};