import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { ThemeProvider } from "../components/ThemeContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";

// Import local avatars
import sunflower from "../assets/avatars/sunflower.png";
import robot from "../assets/avatars/robot.png";
import bird from "../assets/avatars/bird.png";
import cat from "../assets/avatars/cat.png";
import ladybird from "../assets/avatars/ladybird.png";
import leaf from "../assets/avatars/leaf.png";
import pirate from "../assets/avatars/pirate.png";
import dragon from "../assets/avatars/dragon.png";
import waves from "../assets/avatars/waves.png";
import cloud from "../assets/avatars/cloud.png";
import { updateProfile } from "firebase/auth";

const presetAvatars = [sunflower, robot, bird, cat, ladybird, leaf, pirate, dragon, waves, cloud];

const zeffraPic = "/logo-wob.png";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!selectedAvatar) return alert("Please select an avatar.");

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const photoURL = selectedAvatar;

      await updateProfile(user, { photoURL });

      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/assets/Login-cover.webp')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="bg-white bg-opacity-70 dark:bg-opacity-50  relative z-10 p-8 rounded-2xl shadow-2xl max-w-md w-11/12">
          <img className="mx-auto mb-8 w-48" src={zeffraPic} alt="Zeffra Logo" />
          <h1 className="text-center text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-700 drop-shadow-md tracking-wide uppercase">
            Register
          </h1>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              className="bg-white text-black dark:bg-gray-900 dark:text-white border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="bg-white text-black dark:bg-gray-900 dark:text-white border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <p className="mt-4 font-semibold">Choose your avatar:</p>
            <div className="grid grid-cols-5 gap-3 my-2">
              {presetAvatars.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Avatar ${idx}`}
                  className={`w-14 h-14 rounded-full cursor-pointer transition border-2 ${selectedAvatar === img ? "ring-4 ring-blue-500" : "hover:ring-2 hover:ring-blue-300"
                    }`}
                  onClick={() => setSelectedAvatar(img)}
                />
              ))}
            </div>

            <button
              disabled={loading}
              className={`bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors ${loading && "opacity-50 cursor-not-allowed"}`}
              type="submit"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <button
              className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors"
              type="button"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </ThemeProvider>
  );
}