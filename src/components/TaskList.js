'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { tasksCollection, auth } from '../lib/firebase';
import {
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Edit, Delete, Logout } from '@mui/icons-material';
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  TableContainer,
  Paper,
  IconButton,
  Typography,
  Grid,
} from '@mui/material';
import { Reorder } from 'framer-motion';

export default function Page() {
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('To Do');
  const [editTaskId, setEditTaskId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const queryClient = useQueryClient();

  useQuery({
    queryKey: ['tasks', user?.uid],
    queryFn: async () => {
      if (!user) return [];
      const q = query(tasksCollection, where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const taskList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(taskList);
      return taskList;
    },
    enabled: !!user,
  });

  const addTaskMutation = useMutation({
    mutationFn: async (newTask) => {
      if (!user) return;
      await addDoc(tasksCollection, { ...newTask, uid: user.uid });
    },
    onSuccess: () => queryClient.invalidateQueries(['tasks', user?.uid]),
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (updatedTask) => {
      if (!editTaskId) return;
      await updateDoc(doc(tasksCollection, editTaskId), updatedTask);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', user?.uid]);
      setEditTaskId(null);
      setTask('');
      setPriority('Medium');
      setStatus('To Do');
      setDueDate('');
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id) => {
      await deleteDoc(doc(tasksCollection, id));
    },
    onSuccess: () => queryClient.invalidateQueries(['tasks', user?.uid]),
  });

  const handleEdit = (t) => {
    setTask(t.text);
    setPriority(t.priority);
    setStatus(t.status);
    setDueDate(t.dueDate);
    setEditTaskId(t.id);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/auth/login');
  };

  return (
    <Container maxWidth='lg' sx={{ mt: 4 }}>
      <Button
        onClick={handleLogout}
        variant='contained'
        color='error'
        sx={{ float: 'right' }}
      >
        <Logout /> Logout
      </Button>
      <Typography variant='h4' align='center' gutterBottom sx={{ color: 'black' }}>
        Task Management App
      </Typography>

      <Grid container spacing={2} alignItems='center' sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label='Task' variant='outlined' value={task} onChange={(e) => setTask(e.target.value)} />
        </Grid>
        <Grid item xs={6} sm={2}>
          <Select fullWidth value={priority} onChange={(e) => setPriority(e.target.value)}>
            <MenuItem value='Low'>Low</MenuItem>
            <MenuItem value='Medium'>Medium</MenuItem>
            <MenuItem value='High'>High</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={6} sm={2}>
          <Select fullWidth value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value='To Do'>To Do</MenuItem>
            <MenuItem value='In Progress'>In Progress</MenuItem>
            <MenuItem value='Completed'>Completed</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField fullWidth type='date' variant='outlined' value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={2}>
          {editTaskId ? (
            <Button fullWidth variant='contained' color='secondary' onClick={() => updateTaskMutation.mutate({ text: task, priority, status, dueDate })}>
              Update Task
            </Button>
          ) : (
            <Button fullWidth variant='contained' color='primary' onClick={() => addTaskMutation.mutate({ text: task, priority, status, dueDate, uid: user.uid })}>
              Add Task
            </Button>
          )}
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ mt: 2, p: 2 }}>
        <Reorder.Group axis='y' values={tasks} onReorder={setTasks}>
          {tasks.map((t) => (
            <Reorder.Item key={t.id} value={t} whileDrag={{ scale: 1.05 }}>
              <Grid container alignItems='center' spacing={2} sx={{ mb: 1, p: 1, bgcolor: 'grey.100', borderRadius: 2 }}>
                <Grid item xs={4}>{t.text}</Grid>
                <Grid item xs={2}>{t.priority}</Grid>
                <Grid item xs={2}>{t.dueDate || 'No date'}</Grid>
                <Grid item xs={2}>{t.status}</Grid>
                <Grid item xs={2}>
                  <IconButton color='secondary' onClick={() => handleEdit(t)}>
                    <Edit />
                  </IconButton>
                  <IconButton color='error' onClick={() => deleteTaskMutation.mutate(t.id)}>
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </TableContainer>
    </Container>
  );
}
