import { useContext } from "react";
import { AuthContext } from "../context/authcontext";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;