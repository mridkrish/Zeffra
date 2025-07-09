import * as firestore from "../services/firestore";

export const actions = {
  // Boards
  createBoard: firestore.createBoard,
  updateBoard: firestore.updateBoard,
  deleteBoard: firestore.deleteBoard,

  // Lists
  createList: firestore.createList,
  updateList: firestore.updateList,
  deleteList: firestore.deleteList,

  // Tasks
  createTask: firestore.createTask,
  updateTask: firestore.updateTask,
  deleteTask: firestore.deleteTask,

  // Subscriptions
  subscribeBoards: firestore.subscribeBoards,
  subscribeLists: firestore.subscribeLists,
  subscribeTasks: firestore.subscribeTasks,
};