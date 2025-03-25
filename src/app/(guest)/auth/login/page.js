'use client';

import { useState } from 'react';
import { 
  Button, TextField, Typography, Divider, IconButton, 
  InputAdornment, CircularProgress, Paper, Box, Container 
} from '@mui/material';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, signInWithGooglePopup, tasksCollection, userCollection } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const LoginPage = () => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const router = useRouter();

  const handleClickShowPassword = () => setIsPasswordShown((prev) => !prev);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const user = userCredential.user;

      const userRef = doc(userCollection, user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        router.push(`/store/${user.uid}`);
      } else {
        setErrorMessage('No store found for this user.');
      }
    } catch (error) {
      setErrorMessage('Invalid email or password.');
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
      <Container component="main" maxWidth="xs">
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
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Welcome Back!
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            sx={{ my: 2, py: 1.5, display: 'flex', gap: 1 }}
            onClick={signInWithGooglePopup}
            disabled={isLoading}
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            {isLoading ? <CircularProgress size={18} color="inherit" /> : 'Sign in with Google'}
          </Button>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type={isPasswordShown ? 'text' : 'password'}
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {isPasswordShown ? <RiEyeOffLine /> : <RiEyeLine />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {errorMessage && (
              <Typography color="error" variant="body2">
                {errorMessage}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              Sign in
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" color="textSecondary">
            Don't have an account?{' '}
            <Button color="primary" onClick={() => router.push('/auth/register')}>
              Create an account
            </Button>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
