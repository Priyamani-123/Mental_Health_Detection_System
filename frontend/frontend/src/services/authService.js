import API from "../api/axios";

export const loginUser = async ({ email,password})=> {
  try {
    const res = await API.post("/auth/login",{
      email:email,
      password:password,
    } );
    localStorage.setItem("token", res.data.access_token);
    return res.data;
  } catch (error) {
    console.log("LOGIN  ERROR:",error.response?.data);
    throw error.response?.data ||{
      message: "Login failed. Please try again."
    };
  }
};

export const registerUser = async (data) => {
  try {
    const res = await API.post("/auth/register", data);
    return res.data;
  } catch (error) {
    throw error.response?.data ||{
      message: "Registration failed. Please try again."
    };
  }
};