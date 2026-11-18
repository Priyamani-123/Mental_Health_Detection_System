import { useContext } from "react";
import { AuthContext } from "../context/AuthService";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;