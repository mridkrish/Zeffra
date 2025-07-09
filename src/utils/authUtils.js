import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export const handleLogout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};