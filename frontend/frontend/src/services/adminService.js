import API from "../api/axios";

export const getAdminDashboard = async () => {
  try{
    const res = await API.get("/admin/dashboard");
    return res.data;
  } catch (error) {
    throw error.response?.data ||{
      message: "Failed to fetch admin dashboard."
    };
  }
};

export const getAllUsers = async () => {
  try {
    const res = await API.get("/admin/users");
    return res.data;
  } catch (error) {
    throw error.response?.data ||{
      message: "Failed to fetch all users."
    };
  }
};

export const deleteUserById = async (id) => {
  try {
    const res = await API.delete(`/admin/users/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data ||{
      message: "Failed to delete user."
    };
  }
};