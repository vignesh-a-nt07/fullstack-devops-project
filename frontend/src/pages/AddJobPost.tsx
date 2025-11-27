import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createJobPost, updateJobPost } from '../api/auth';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface JobPost {
  title?: string;
  company_intro?: string;
  position?: string;
  location?: string;
  employment_type?: string;
  department?: string;
  position_summary?: string;
  key_responsibilities?: string[] | string;
  required_qualifications?: string[] | string;
  preferred_qualifications?: string[] | string;
  addons?: Record<string, unknown> | null;
  why_join_us?: string;
  id?: number | string;
}

const AddJobPost: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as { job?: JobPost } | null) || null;
  const editingJob = state?.job;

  const [form, setForm] = useState(
    () =>
      ({
        title: '',
        company_intro: '',
        position: '',
        location: '',
        employment_type: '',
        department: '',
        position_summary: '',
        key_responsibilities: '', // comma-separated
        required_qualifications: '',
        preferred_qualifications: '',
        addons: '', // JSON string
        why_join_us: '',
      } as {
        title: string;
        company_intro: string;
        position: string;
        location: string;
        employment_type: string;
        department: string;
        position_summary: string;
        key_responsibilities: string;
        required_qualifications: string;
        preferred_qualifications: string;
        addons: string;
        why_join_us: string;
      })
  );

  // populate if editing
  React.useEffect(() => {
    if (editingJob) {
      setForm({
        title: editingJob.title ?? '',
        company_intro: editingJob.company_intro ?? '',
        position: editingJob.position ?? '',
        location: editingJob.location ?? '',
        employment_type: editingJob.employment_type ?? '',
        department: editingJob.department ?? '',
        position_summary: editingJob.position_summary ?? '',
        key_responsibilities: Array.isArray(editingJob.key_responsibilities)
          ? editingJob.key_responsibilities.join(', ')
          : editingJob.key_responsibilities ?? '',
        required_qualifications: Array.isArray(editingJob.required_qualifications)
          ? editingJob.required_qualifications.join(', ')
          : editingJob.required_qualifications ?? '',
        preferred_qualifications: Array.isArray(editingJob.preferred_qualifications)
          ? editingJob.preferred_qualifications.join(', ')
          : editingJob.preferred_qualifications ?? '',
        addons: editingJob.addons ? JSON.stringify(editingJob.addons) : '',
        why_join_us: editingJob.why_join_us ?? '',
      });
    }
  }, [editingJob]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target as { name: string; value: string };
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        title: form.title,
        company_intro: form.company_intro,
        position: form.position,
        location: form.location,
        employment_type: form.employment_type,
        department: form.department,
        position_summary: form.position_summary,
        key_responsibilities: form.key_responsibilities
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        required_qualifications: form.required_qualifications
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        preferred_qualifications: form.preferred_qualifications
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        addons: form.addons ? JSON.parse(form.addons) : {},
        why_join_us: form.why_join_us,
      };
      if (editingJob && editingJob.id) {
        await updateJobPost(Number(editingJob.id), payload);
      } else {
        await createJobPost(payload);
      }
      setSnackbar({ open: true, message: 'Job post created', severity: 'success' });
      setTimeout(() => navigate('/jobposts'), 600);
    } catch (err: unknown) {
      console.error('Create job post failed', err);
      setSnackbar({
        open: true,
        message: (err as Error)?.message || 'Create failed',
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }} color="primary">
        Add Job Post
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          fullWidth
          margin="normal"
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Company Intro"
          name="company_intro"
          value={form.company_intro}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Position"
          name="position"
          value={form.position}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="employment-type-label">Employment Type</InputLabel>
          <Select
            labelId="employment-type-label"
            label="Employment Type"
            name="employment_type"
            value={form.employment_type}
            onChange={handleSelectChange}
          >
            <MenuItem value="full_time">Full Time</MenuItem>
            <MenuItem value="part_time">Part Time</MenuItem>
            <MenuItem value="contract">Contract</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          label="Department"
          name="department"
          value={form.department}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Position Summary"
          name="position_summary"
          value={form.position_summary}
          onChange={handleChange}
          multiline
          rows={3}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Key Responsibilities (comma separated)"
          name="key_responsibilities"
          value={form.key_responsibilities}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Required Qualifications (comma separated)"
          name="required_qualifications"
          value={form.required_qualifications}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Preferred Qualifications (comma separated)"
          name="preferred_qualifications"
          value={form.preferred_qualifications}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Addons (JSON)"
          name="addons"
          value={form.addons}
          onChange={handleChange}
          multiline
          rows={3}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Why Join Us"
          name="why_join_us"
          value={form.why_join_us}
          onChange={handleChange}
          multiline
          rows={3}
        />
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Create
          </Button>
          <Button variant="outlined" onClick={() => navigate('/jobposts')}>
            Cancel
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddJobPost;
