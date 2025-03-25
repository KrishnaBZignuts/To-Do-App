'use client';

import { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress,
  Paper,
  Box,
  Container,
} from '@mui/material';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, userCollection } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const RegisterPage = () => {
  const [form, setForm] = useState({ email: '', password: '', displayName: '' });
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordValid, setPasswordValid] = useState(true);
  const router = useRouter();

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'password') {
      setPasswordValid(passwordRegex.test(value));
    }
  };

  const handleClickShowPassword = () => setIsPasswordShown((prev) => !prev);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!passwordValid) {
      setError('Password does not meet the required criteria.');
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      await setDoc(doc(usersCollection, user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: form.displayName,
        createdAt: new Date(),
      });

      router.push('/auth/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        p: 2,
      }}
    >
      <Container component='main' maxWidth='xs'>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3, 
            boxShadow: 3, 
            backgroundColor: '#f9f9f9', 
            textAlign: 'center',
          }}
        >
          <Typography variant='h5' fontWeight='bold' gutterBottom>
            Create an Account
          </Typography>

          {error && (
            <Typography color='error' variant='body2' sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Box component='form' onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label='Full Name'
              variant='outlined'
              name='displayName'
              required
              value={form.displayName}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label='Email'
              variant='outlined'
              name='email'
              type='email'
              required
              value={form.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label='Password'
              variant='outlined'
              name='password'
              type={isPasswordShown ? 'text' : 'password'}
              required
              value={form.password}
              onChange={handleChange}
              error={!passwordValid && form.password.length > 0}
              helperText={
                !passwordValid && form.password.length > 0
                  ? 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a number.'
                  : ''
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={handleClickShowPassword}>
                      {isPasswordShown ? <RiEyeOffLine /> : <RiEyeLine />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type='submit'
              variant='contained'
              color='primary'
              fullWidth
              sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={18} color='inherit' /> : null}
            >
              Register
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant='body2' color='textSecondary'>
            Already have an account?{' '}
            <Button color='primary' onClick={() => router.push('/auth/login')}>
              Login
            </Button>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
