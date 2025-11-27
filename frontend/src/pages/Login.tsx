import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../utils/auth';
import { loginApi, fetchUserDetails } from '../api/auth';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = sessionStorage.getItem('session_token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginApi(username, password);
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || 'Invalid credentials');
        return;
      }
      const data = await res.json();
      if (data.access_token) {
        setToken(data.access_token);
        // Fetch user details and save user_role
        try {
          const userRes = await fetchUserDetails(data.access_token);
          if (userRes.ok) {
            const userData = await userRes.json();
            if (userData.role) {
              sessionStorage.setItem('user_role', userData.role);
            }
          }
        } catch (e) {
          console.error('Failed to fetch user details:', e);
          setError(e instanceof Error ? e.message : 'Failed to fetch user details');
        }
        navigate('/');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>Login | HireHub ATS</title>
      <meta
        name="description"
        content="Login to your HireHub ATS account to manage your recruitment process efficiently."
      />
      <Container maxWidth="xs">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: '100%', bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 3 }}
          >
            <Typography variant="h5" component="h1" gutterBottom>
              FireHub🔥 ATS Login
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
              margin="normal"
              autoComplete="username"
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              margin="normal"
              autoComplete="current-password"
            />

            <Box sx={{ position: 'relative', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
            </Box>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button href="/signup" size="small">
                Don't have an account? Create one
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
