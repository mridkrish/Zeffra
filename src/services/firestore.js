import { writeBatch } from "firebase/firestore";

import {
  db
} from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  setDoc
} from "firebase/firestore";

export const saveNotesForUser = async (userId, notes) => {
  const docRef = doc(db, "notepad", userId);
  await setDoc(docRef, { notes, updatedAt: serverTimestamp() });
};

export const getNotesForUser = async (userId) => {
  const docRef = doc(db, "notepad", userId);
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data().notes : [];
};

// Create Board
export const createBoard = async (name) => {
  try {
    const boardRef = collection(db, "boards");
    const newBoard = await addDoc(boardRef, {
      name,
      createdAt: serverTimestamp()
    });
    return newBoard.id;
  } catch (error) {
    console.error("Error creating board:", error);
    throw error;
  }
};

// Subscribe to Boards (Realtime) with ordering by creation date
export const subscribeBoards = (callback) => {
  const boardsRef = collection(db, "boards");
  const q = query(boardsRef, orderBy("createdAt", "asc"));
  const unsub = onSnapshot(q, (snapshot) => {
    const boards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(boards);
  }, (error) => {
    console.error("Error fetching boards:", error);
  });
  return unsub;
};

// Create List inside Board
export const createList = async (boardId, title, dueDate = null) => {
  try {
    const listRef = collection(db, `boards/${boardId}/lists`);
    const newList = await addDoc(listRef, {
      title,
      dueDate: dueDate ? new Date(dueDate) : null,
      createdAt: serverTimestamp(),
    });
    return newList.id;
  } catch (error) {
    console.error("Error creating list:", error);
    throw error;
  }
};

// Subscribe to Lists for Board (Realtime) with ordering
export const subscribeLists = (boardId, callback) => {
  const listsRef = collection(db, `boards/${boardId}/lists`);
  const q = query(listsRef, orderBy("createdAt", "asc"));
  const unsub = onSnapshot(q, (snapshot) => {
    const lists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(lists);
  }, (error) => {
    console.error("Error fetching lists:", error);
  });
  return unsub;
};

export const createTask = async (boardId, listId, title, labels = [], order = 0) => {
  try {
    const taskRef = collection(db, `boards/${boardId}/lists/${listId}/tasks`);
    const newTask = await addDoc(taskRef, {
      title,
      labels,
      order,
      createdAt: serverTimestamp(),
    });
    return newTask.id;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const reorderTasks = async (boardId, listId, tasks) => {
  try {
    const batch = writeBatch(db);

    tasks.forEach((task, index) => {
      const taskDoc = doc(db, `boards/${boardId}/lists/${listId}/tasks`, task.id);
      batch.update(taskDoc, { order: index });
    });

    console.log("🔃 Batched reorder:", tasks.map(t => `${t.title} (${t.order})`));
    await batch.commit();
  } catch (error) {
    console.error("🔥 Error in batched reorderTasks:", error);
    throw error;
  }
};

export const subscribeTasks = (boardId, listId, callback) => {
  const tasksRef = collection(db, `boards/${boardId}/lists/${listId}/tasks`);
  const q = query(tasksRef, orderBy("order", "asc")); // ✅ Sorted by order
  const unsub = onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("📦 Firestore tasks:", tasks.map(t => `${t.title} (${t.order})`));
    callback(tasks);
  }, (error) => {
    console.error("Error fetching tasks:", error);
  });
  return unsub;
};

// --- NEW: Update Board ---
export const updateBoard = async (boardId, newName) => {
  try {
    const boardDoc = doc(db, "boards", boardId);
    await updateDoc(boardDoc, { name: newName });
  } catch (error) {
    console.error("Error updating board:", error);
    throw error;
  }
};

export const deleteBoard = async (boardId) => {
  try {
    // 1. Get all lists under the board
    const listsSnapshot = await getDocs(collection(db, "boards", boardId, "lists"));

    // 2. For each list, delete all tasks
    for (const listDoc of listsSnapshot.docs) {
      const listId = listDoc.id;

      // Get tasks under the list
      const tasksSnapshot = await getDocs(collection(db, "boards", boardId, "lists", listId, "tasks"));

      // Delete each task
      for (const taskDoc of tasksSnapshot.docs) {
        await deleteDoc(doc(db, "boards", boardId, "lists", listId, "tasks", taskDoc.id));
      }

      // Delete the list itself
      await deleteDoc(doc(db, "boards", boardId, "lists", listId));
    }

    // 3. Finally, delete the board document itself
    await deleteDoc(doc(db, "boards", boardId));

  } catch (error) {
    console.error("Error deleting board and its content:", error);
    throw error;
  }
};

// Update List (title, dueDate, etc.)
export const updateList = async (boardId, listId, updates) => {
  try {
    const listDocRef = doc(db, `boards/${boardId}/lists`, listId);
    await updateDoc(listDocRef, updates);
  } catch (error) {
    console.error("Error updating list:", error);
    throw error;
  }
};

// --- NEW: Delete List ---
export const deleteList = async (boardId, listId) => {
  try {
    // Delete all tasks under the list first
    const tasksSnapshot = await getDocs(collection(db, "boards", boardId, "lists", listId, "tasks"));
    for (const taskDoc of tasksSnapshot.docs) {
      await deleteDoc(doc(db, "boards", boardId, "lists", listId, "tasks", taskDoc.id));
    }

    // Delete the list itself
    const listDoc = doc(db, `boards/${boardId}/lists`, listId);
    await deleteDoc(listDoc);
  } catch (error) {
    console.error("Error deleting list and tasks:", error);
    throw error;
  }
};


// --- NEW: Update Task ---
export const updateTask = async (boardId, listId, taskId, updates) => {
  try {
    const taskDoc = doc(db, `boards/${boardId}/lists/${listId}/tasks`, taskId);
    await updateDoc(taskDoc, updates);
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// --- NEW: Delete Task ---
export const deleteTask = async (boardId, listId, taskId) => {
  try {
    const taskDoc = doc(db, `boards/${boardId}/lists/${listId}/tasks`, taskId);
    await deleteDoc(taskDoc);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const updateTaskOrder = async (boardId, listId, taskId, order) => {
  try {
    const taskDoc = doc(db, `boards/${boardId}/lists/${listId}/tasks`, taskId);
    await updateDoc(taskDoc, { order });
  } catch (error) {
    console.error("Error updating task order:", error);
    throw error;
  }
};
