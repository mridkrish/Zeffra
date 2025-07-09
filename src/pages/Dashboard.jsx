import React, { useState, useEffect } from "react";
import BoardList from "../components/BoardList";
import { ThemeProvider } from "../components/ThemeContext";
import BoardView from "../components/BoardView";
import { useNavigate } from "react-router-dom";
import zeffraPic from '../assets/Zeffra1.png';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

import { subscribeBoards } from "../services/firestore";

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  useEffect(() => {
    const unsub = subscribeBoards(setBoards);
    return () => unsub();
  }, []);


  return (
    <ThemeProvider>
      <div className="p-4 relative min-h-screen">
        <header className="fixed top-0 left-0 w-full py-4 z-50 bg-gray-900 bg-opacity-80 backdrop-blur-md">
          <div className="flex items-center justify-center gap-2">
            <img
              src={zeffraPic}
              alt="Zeffra logo"
              className="object-contain"
              style={{ height: '81px', width: '81px' }}
            />
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-700 drop-shadow-md tracking-wide uppercase">
              Dashboard
            </h1>
          </div>

          {user && (
            <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-50">
              {/* Row with profile and logout side-by-side */}
              <div className="flex items-center gap-3">
                <a href="/profile" title="View Profile">
                  <img
                    src={
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=random`
                    }
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border hover:ring-2 ring-blue-400 transition duration-200"
                  />
                </a>
                <button
                  onClick={() => navigate("/logout")}
                  className="bg-red-500 text-white px-3 py-1 rounded shadow"
                >
                  Logout
                </button>
              </div>

              {/* Notepad button below profile/logout */}
              <button
                onClick={() => navigate("/dashboard/notepad")}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded shadow-lg transition"
              >
                📝 Notepad
              </button>
            </div>
          )}

          {user && (
            <p className="mt-1 text-white font-semibold font-serif tracking-wide text-center">
              Logged in as {user.email}
            </p>
          )}
        </header>

        <main className="mt-40">
          <BoardList boards={boards} onSelect={setSelectedBoardId} />

          {selectedBoardId ? (
            <BoardView boardId={selectedBoardId} />
          ) : (
            <p className="mt-4 text-gray-300 text-center">Select or create a board to get started.</p>
          )}
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;