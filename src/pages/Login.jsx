import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { ThemeProvider } from "../components/ThemeContext";

const zeffraPic = "/logo-wob.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in");
      navigate("/dashboard");
    } catch (error) {
      console.error(error.message);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <ThemeProvider>
      <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/assets/Login-cover.webp')" }}>
        {/* darker overlay for better contrast */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="bg-white bg-opacity-70 dark:bg-opacity-50  relative z-10 p-8 rounded-2xl shadow-2xl max-w-md w-11/12">
          <img className="mx-auto mb-8 w-48" src={zeffraPic} alt="Zeffra Logo" />
          <h1 className="text-center text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-700 drop-shadow-md tracking-wide uppercase">
            Login
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              className="bg-white text-black dark:bg-gray-900 dark:text-white text-black border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="bg-white text-black dark:bg-gray-900 dark:text-white text-black border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors">
              Login
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors"
              type="button"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </ThemeProvider>
  );
}