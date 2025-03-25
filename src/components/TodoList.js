"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { tasksCollection, auth } from "../lib/firebase";
import { addDoc, getDocs, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { CheckCircle, Trash2, Pencil, LogOut } from "lucide-react";
import { Reorder, motion } from "framer-motion";

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const querySnapshot = await getDocs(tasksCollection);
    const fetchedTasks = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    fetchedTasks.sort((a, b) => a.order - b.order); 
    setTasks(fetchedTasks);
  };

  const addTask = async () => {
    if (task.trim() === "") return;
    await addDoc(tasksCollection, { text: task, completed: false, order: tasks.length });
    setTask("");
    fetchTasks();
  };

  const toggleComplete = async (id, completed) => {
    await updateDoc(doc(tasksCollection, id), { completed: !completed });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(tasksCollection, id));
    fetchTasks();
  };

  const openEditModal = (task) => {
    setEditTask(task);
    setEditText(task.text);
    setIsModalOpen(true);
  };

  const updateTask = async () => {
    if (!editTask || editText.trim() === "") return;
    await updateDoc(doc(tasksCollection, editTask.id), { text: editText });
    setIsModalOpen(false);
    setEditTask(null);
    setEditText("");
    fetchTasks();
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/auth/login");
  };

  const handleReorder = async (newOrder) => {
    setTasks(newOrder); 
    const batch = writeBatch(tasksCollection.firestore);
    newOrder.forEach((task, index) => {
      const taskRef = doc(tasksCollection, task.id);
      batch.update(taskRef, { order: index }); 
    });
    await batch.commit();
  };

  return (
    <>
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center gap-2"
      >
        <LogOut size={18} />
        Logout
      </button>

      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md w-130 relative">
        <h1 className="text-2xl font-bold text-center mb-4 text-black">To-Do App</h1>

        <div className="flex mb-4">
          <input
            type="text"
            className="w-full p-2 border rounded mr-3"
            placeholder="Add a new task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            style={{ color: "black" }}
          />
          <button onClick={addTask} className="px-4 bg-blue-500 text-white rounded">Add</button>
        </div>

        <Reorder.Group as="ul" axis="y" values={tasks} onReorder={handleReorder} className="space-y-2">
          {tasks.map((t) => (
            <Reorder.Item key={t.id} value={t} className="list-none">
              <motion.div
                className="flex justify-between items-center p-3 border rounded-lg shadow-sm bg-gray-100 cursor-grab"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={t.completed ? "line-through text-gray-500" : ""} style={{ color: "black" }}>
                  {t.text}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => toggleComplete(t.id, t.completed)} className="p-2 text-green-600 hover:text-green-800 transition">
                    <CheckCircle size={20} />
                  </button>
                  <button onClick={() => openEditModal(t)} className="p-2 text-blue-600 hover:text-blue-800 transition">
                    <Pencil size={20} />
                  </button>
                  <button onClick={() => deleteTask(t.id)} className="p-2 text-red-600 hover:text-red-800 transition">
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4 text-black">Edit Task</h2>
              <input
                type="text"
                className="w-full p-2 border rounded mb-4 text-black"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                <button onClick={updateTask} className="px-4 py-2 bg-blue-500 text-white rounded">Update</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
