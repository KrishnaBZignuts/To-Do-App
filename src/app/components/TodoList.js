'use client';
import { useEffect, useState } from 'react';
import { tasksCollection } from '../lib/firebase';
import { addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { CheckCircle, Trash2, Pencil } from 'lucide-react';

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [editTask, setEditTask] = useState(null); 
  const [editText, setEditText] = useState(''); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const querySnapshot = await getDocs(tasksCollection);
    setTasks(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const addTask = async () => {
    if (task.trim() === '') return;
    await addDoc(tasksCollection, { text: task, completed: false });
    setTask('');
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
    if (!editTask || editText.trim() === '') return;

    await updateDoc(doc(tasksCollection, editTask.id), { text: editText });
    setIsModalOpen(false);
    setEditTask(null);
    setEditText('');
    fetchTasks();
  };

  return (
    <div className='max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md w-130'>
      <h1 className='text-2xl font-bold text-center mb-4 text-black'>
        To-Do App
      </h1>

      <div className='flex mb-4'>
        <input
          type='text'
          className='w-full p-2 border rounded mr-3'
          placeholder='Add a new task...'
          value={task}
          onChange={(e) => setTask(e.target.value)}
          style={{ color: 'black' }}
        />
        <button
          onClick={addTask}
          className='px-4 bg-blue-500 text-white rounded'
        >
          Add
        </button>
      </div>

      <ul>
        {tasks.map((t) => (
          <li
            key={t.id}
            className='flex justify-between items-center p-2 border-b'
          >
            <span
              className={t.completed ? 'line-through' : ''}
              style={{ color: 'black' }}
            >
              {t.text}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => toggleComplete(t.id, t.completed)}
                className='p-2 text-green-600 hover:text-green-800 transition'
              >
                <CheckCircle size={20} />
              </button>

              <button
                onClick={() => openEditModal(t)}
                className='p-2 text-blue-600 hover:text-blue-800 transition'
              >
                <Pencil size={20} /> 
              </button>

              <button
                onClick={() => deleteTask(t.id)}
                className='p-2 text-red-600 hover:text-red-800 transition'
              >
                <Trash2 size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
            <h2 className='text-xl font-bold mb-4 text-black'>Edit Task</h2>
            <input
              type='text'
              className='w-full p-2 border rounded mb-4 text-black'
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <div className='flex justify-end gap-2'>
              <button
                onClick={() => setIsModalOpen(false)}
                className='px-4 py-2 bg-gray-500 text-white rounded'
              >
                Cancel
              </button>
              <button
                onClick={updateTask}
                className='px-4 py-2 bg-blue-500 text-white rounded'
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
