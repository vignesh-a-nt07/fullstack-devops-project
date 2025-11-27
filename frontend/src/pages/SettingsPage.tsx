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
  Snackbar,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchConfigs, createConfig, updateConfig, deleteConfig } from '../api/auth';

interface ConfigItem {
  config_id: number;
  path: string;
  value: string;
  updated_at?: string;
}

const SettingsPage: React.FC = () => {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState({
    config_id: '',
    path: '',
    value: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchConfigs()
      .then((data) => {
        const items: unknown[] = Array.isArray(data)
          ? data
          : data &&
            typeof data === 'object' &&
            Array.isArray((data as Record<string, unknown>)?.items)
          ? ((data as Record<string, unknown>)?.items as unknown[])
          : [];
        const normalized: ConfigItem[] = items.map((it: unknown) => {
          const obj = it as Record<string, unknown>;
          return {
            config_id: Number(obj?.config_id ?? obj?.id ?? 0) || 0,
            path: String(obj?.path ?? ''),
            value: String(obj?.value ?? ''),
            updated_at: (obj?.updated_at ?? obj?.updatedAt) as string | undefined,
          } as ConfigItem;
        });
        setConfigs(normalized);
      })
      .catch((err: unknown) => {
        console.error('Failed to fetch configs', err);
        setSnackbar({
          open: true,
          message: (err as Error)?.message || 'Failed to fetch configs',
          severity: 'error',
        });
      });
  }, []);

  const handleOpenAdd = () => {
    setDialogMode('add');
    setFormData({ config_id: '', path: '', value: '' });
    setOpenDialog(true);
  };

  const handleOpenEdit = (config: ConfigItem) => {
    setDialogMode('edit');
    setFormData({ config_id: String(config.config_id), path: config.path, value: config.value });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'add') {
        await createConfig({ path: formData.path, value: formData.value });
        setSnackbar({ open: true, message: 'Config added successfully!', severity: 'success' });
      } else {
        await updateConfig(Number(formData.config_id), {
          path: formData.path,
          value: formData.value,
        });
        setSnackbar({ open: true, message: 'Config updated successfully!', severity: 'success' });
      }
      fetchConfigs().then((data) => {
        const items: unknown[] = Array.isArray(data)
          ? data
          : Array.isArray((data as Record<string, unknown>)?.items)
          ? ((data as Record<string, unknown>)?.items as unknown[])
          : [];
        const normalized: ConfigItem[] = items.map((it: unknown) => {
          const obj = it as Record<string, unknown>;
          return {
            config_id: Number(obj?.config_id ?? obj?.id ?? 0) || 0,
            path: String(obj?.path ?? ''),
            value: String(obj?.value ?? ''),
            updated_at: (obj?.updated_at ?? obj?.updatedAt) as string | undefined,
          } as ConfigItem;
        });
        setConfigs(normalized);
      });
      setOpenDialog(false);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: (error as Error)?.message || 'Operation failed!',
        severity: 'error',
      });
    }
  };

  const handleDelete = async (config_id: number) => {
    try {
      await deleteConfig(config_id);
      setSnackbar({ open: true, message: 'Config deleted successfully!', severity: 'success' });
      fetchConfigs().then((data) => {
        const items: unknown[] = Array.isArray(data)
          ? data
          : Array.isArray((data as Record<string, unknown>)?.items)
          ? ((data as Record<string, unknown>)?.items as unknown[])
          : [];
        const normalized: ConfigItem[] = items.map((it: unknown) => {
          const obj = it as Record<string, unknown>;
          return {
            config_id: Number(obj?.config_id ?? obj?.id ?? 0) || 0,
            path: String(obj?.path ?? ''),
            value: String(obj?.value ?? ''),
            updated_at: (obj?.updated_at ?? obj?.updatedAt) as string | undefined,
          } as ConfigItem;
        });
        setConfigs(normalized);
      });
    } catch (err: unknown) {
      console.error(err);
      setSnackbar({ open: true, message: 'Delete failed!', severity: 'error' });
    }
  };

  return (
    <>
      <title>Settings | HireHub ATS</title>
      <meta
        name="description"
        content="Manage your application settings and configurations on the HireHub ATS Settings page."
      />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }} color="primary" gutterBottom>
          Configurations
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ mb: 2 }}
          onClick={handleOpenAdd}
        >
          Add Config
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Path</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Value</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Updated At</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {configs.map((config: ConfigItem) => (
                <TableRow key={config.config_id}>
                  <TableCell>{config.path}</TableCell>
                  <TableCell>{config.value}</TableCell>
                  <TableCell>
                    {config.updated_at ? new Date(config.updated_at).toLocaleString() : ''}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenEdit(config)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(config.config_id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{dialogMode === 'add' ? 'Add Config' : 'Edit Config'}</DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              label="Path"
              name="path"
              fullWidth
              value={formData.path}
              onChange={handleFormChange}
            />
            <TextField
              margin="normal"
              label="Value"
              name="value"
              fullWidth
              value={formData.value}
              onChange={handleFormChange}
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

export default SettingsPage;
