import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { fetchUsers, createUser, updateUser } from '../api/auth';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState<Partial<User> & { password?: string }>({
    id: undefined,
    name: '',
    email: '',
    role: '',
    is_active: true,
    password: '',
  });

  useEffect(() => {
    fetchUsers()
      .then((data) => {
        const items: unknown[] = Array.isArray(data)
          ? data
          : Array.isArray((data as Record<string, unknown>)?.items)
          ? ((data as Record<string, unknown>)?.items as unknown[])
          : [];
        const normalized = items.map((it: unknown) => {
          const obj = it as Record<string, unknown>;
          return {
            id: Number(obj?.id ?? obj?.user_id ?? 0) || 0,
            name: String(obj?.name ?? ''),
            email: String(obj?.email ?? ''),
            role: String(obj?.role ?? 'user'),
            is_active: Boolean(obj?.is_active ?? obj?.isActive ?? true),
          } as User;
        });
        setUsers(normalized);
      })
      .catch((err: unknown) => {
        console.error('Failed to fetch users', err);
        setSnackbar({
          open: true,
          message: (err as Error)?.message || 'Failed to fetch users',
          severity: 'error',
        });
      });
  }, []);

  const handleOpenAdd = () => {
    setDialogMode('add');
    setFormData({ id: undefined, name: '', email: '', role: '', is_active: true, password: '' });
    setOpenDialog(true);
  };

  const handleOpenEdit = (user: User) => {
    setDialogMode('edit');
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      password: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'add') {
        await createUser(formData);
        setSnackbar({ open: true, message: 'User added successfully!', severity: 'success' });
      } else {
        await updateUser(Number(formData.id), formData);
        setSnackbar({ open: true, message: 'User updated successfully!', severity: 'success' });
      }
      fetchUsers()
        .then(setUsers)
        .catch((err) => {
          setSnackbar({
            open: true,
            message: err?.message || 'Failed to fetch users',
            severity: 'error',
          });
        });
      setOpenDialog(false);
    } catch (error: unknown) {
      console.error('User operation failed', error);
      setSnackbar({
        open: true,
        message: (error as Error)?.message || 'Operation failed!',
        severity: 'error',
      });
    }
  };

  return (
    <>
      <title>Users | HireHub ATS</title>
      <meta
        name="description"
        content="Manage users and their roles within the HireHub ATS platform."
      />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }} color="primary" gutterBottom>
          User Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ mb: 2 }}
          onClick={handleOpenAdd}
        >
          Add User
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Active</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.is_active ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenEdit(user)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{dialogMode === 'add' ? 'Add User' : 'Edit User'}</DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              label="Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleFormChange}
            />
            <TextField
              margin="normal"
              label="Password"
              name="password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleFormChange}
              autoComplete="new-password"
            />
            <TextField
              margin="normal"
              label="Email"
              name="email"
              fullWidth
              value={formData.email}
              onChange={handleFormChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, is_active: e.target.checked }))
                  }
                  name="is_active"
                  color="primary"
                />
              }
              label="Active"
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {dialogMode === 'add' ? 'Add' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity={snackbar.severity}
            sx={{ width: '100%' }}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default UsersPage;
