import API from "../api/axios";

export const getGeneralSummary = async () => {
  try{
    const res = await API.get("/general/dashboard/summary");
    return res.data;
  } catch (error) {
    throw error.response?.data ||{
      message: "Failed to fetch general summary."
    };
  }
};

export const getGeneralQuestions = async () => {
  try {
    const res = await API.get("/general/assessment/questions");
    return res.data;
  } catch (error) {
    throw error.response?.data ||{
      message: "Failed to fetch general questions."
    };
  }
};

export const submitGeneralAssessment = async (data) => {
  try {
    const res = await API.post("/general/assessment/submit", data);
    return res.data;
  } catch (error) {
    throw error.response?.data ||{
      message: "Failed to submit general assessment."
    };
  }
};

export const getGeneralHistory = async () => {
  try {
    const res = await API.get("/general/history");
    return res.data;
  } catch (error) {
    throw error.response?.data ||{
      message: "Failed to fetch general history."
    };
  }
};