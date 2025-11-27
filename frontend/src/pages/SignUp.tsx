import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../api/auth';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';

const SignUp: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>('user');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload: Record<string, unknown> = {
        name,
        email,
        password,
        role,
        is_active: true,
      };
      await createUser(payload);
      setSuccess('Account created. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>Sign Up | HireHub ATS</title>
      <meta
        name="description"
        content="Create a new account on HireHub ATS to streamline your recruitment process."
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
              Create an account
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <TextField
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              margin="normal"
              autoComplete="name"
            />

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              margin="normal"
              autoComplete="email"
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              margin="normal"
              autoComplete="new-password"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value as string)}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ position: 'relative', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                Create account
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
              <Button href="/login" size="small">
                Already have an account? Login
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default SignUp;
