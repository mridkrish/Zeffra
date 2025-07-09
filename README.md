# Zeffra
🧠 Zeffra — Collaborative Task Board + Notepad
Zeffra is a Kanban-style task management app with an integrated notepad. It allows users to manage tasks visually, assign due dates and labels, collaborate in real time, and jot down notes without leaving the board.

🚀 Features: 
📋 Create, edit, and delete lists and tasks

🏷️ Label tasks with custom tags

📆 Assign due dates to lists

🔍 Search tasks in real-time

🎯 Drag & drop tasks across lists (via react-beautiful-dnd)

🌘 Dark mode toggle

🔥 Real-time data updates using Firestore

🗒️ Notepad Feature

🛠️ Tech Stack
Frontend: React, TailwindCSS

State & UI: React Hooks, Context API

Drag & Drop: react-beautiful-dnd

Backend: Firebase Firestore

Deployment: Firebase Hosting 

💻 Local Setup
Clone the repo

git clone https://github.com/mridkrish/taskify.git
cd taskflow

Install dependencies

npm install
Add Firebase config

Create a .env file and include:

VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

Run locally

npm run dev