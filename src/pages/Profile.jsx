import React, { useState } from "react";
import { updateProfile } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

// Avatar imports
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

const presetAvatars = [sunflower, robot, bird, cat, ladybird, leaf, pirate, dragon, waves, cloud];

export default function Profile() {
  const [user] = useAuthState(auth);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleSaveSelectedAvatar = async () => {
    if (!selectedAvatar || !auth.currentUser) return;

    setUploading(true);
    try {
      await updateProfile(auth.currentUser, { photoURL: selectedAvatar });
      await auth.currentUser.reload();
      alert("Avatar updated!");
    } catch (err) {
      console.error("Avatar update error:", err);
      alert("Failed to update avatar.");
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-10 text-white">
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition z-50"
      >
        Dashboard
      </button>

      <img
        src={
          user.photoURL
            ? `${user.photoURL}?t=${Date.now()}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=random&size=128`
        }
        className="w-24 h-24 rounded-full border mb-4"
        alt="Profile Avatar"
      />

      <div className="text-center mb-4">
        <p className="font-semibold mb-2">Choose your avatar:</p>
        <div className="grid grid-cols-5 gap-4">
          {presetAvatars.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Avatar ${idx}`}
              className={`w-16 h-16 rounded-full border cursor-pointer transition ${selectedAvatar === img ? "ring-4 ring-blue-400" : "hover:ring-2 hover:ring-blue-300"
                }`}
              onClick={() => setSelectedAvatar(img)}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleSaveSelectedAvatar}
        disabled={!selectedAvatar || uploading}
        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
      >
        {uploading ? "Saving..." : "Save Selection"}
      </button>

      <h2 className="text-xl font-bold mt-6">{user.displayName || "User"}</h2>
      <p className="text-gray-500 text-white">{user.email}</p>

      <button
        onClick={() => auth.signOut()}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>

      <button
        onClick={async () => {
          const confirm = window.confirm(
            "Are you sure you want to request account deletion? Your account will be deleted in 24 hours if you do not log in again."
          );
          if (!confirm) return;

          try {
            await fetch("/api/request-account-deletion", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ uid: user.uid, email: user.email }),
            });

            await auth.signOut();

            alert("Your account is scheduled for deletion in 24 hours. Do not log in again.");
            navigate("/login");
          } catch (err) {
            console.error("Deletion request failed", err);
            alert("Error requesting deletion. Try again later.");
          }
        }}
        className="mt-4 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
      >
        Request Account Deletion
      </button>
    </div>
  );
}