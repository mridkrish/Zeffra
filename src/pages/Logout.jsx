import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await signOut(auth);
        navigate("/login");
      } catch (error) {
        console.error("Logout failed", error);
      }
    };

    doLogout();
  }, [navigate]);

  return (
  <div className="flex justify-center items-center h-screen">
    <p className="text-xl">Signing you out...</p>
  </div>
);

};

export default Logout;