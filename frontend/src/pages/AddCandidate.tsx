import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createCandidate, updateCandidate, fetchJobPosts } from '../api/auth';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface Candidate {
  job_post_id?: number;
  name?: string;
  current_location?: string;
  email?: string;
  contact_number?: string;
  slot_availability?: string;
  rate_card_hourly?: number;
  experience_years?: number;
  visa_type?: string;
  willing_to_relocate?: boolean;
  overall_gpt_score?: number;
  notice_period_days?: number;
  cv_file_url?: string;
  remarks?: string;
  id?: number | string;
}

const AddCandidate: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as { candidate?: Candidate } | null) || null;
  const editingCandidate = state?.candidate;

  const [form, setForm] = useState(
    () =>
      ({
        job_post_id: 0,
        name: '',
        current_location: '',
        email: '',
        contact_number: '',
        slot_availability: '',
        rate_card_hourly: 0,
        experience_years: 0,
        visa_type: '',
        willing_to_relocate: false,
        overall_gpt_score: 0,
        notice_period_days: 0,
        cv_file_url: '',
        remarks: '',
      } as {
        job_post_id: number;
        name: string;
        current_location: string;
        email: string;
        contact_number: string;
        slot_availability: string;
        rate_card_hourly: number;
        experience_years: number;
        visa_type: string;
        willing_to_relocate: boolean;
        overall_gpt_score: number;
        notice_period_days: number;
        cv_file_url: string;
        remarks: string;
      })
  );

  const [jobPosts, setJobPosts] = useState<{ id: number; title: string }[]>([]);

  React.useEffect(() => {
    if (editingCandidate) {
      setForm({
        job_post_id: editingCandidate.job_post_id ?? 0,
        name: editingCandidate.name ?? '',
        current_location: editingCandidate.current_location ?? '',
        email: editingCandidate.email ?? '',
        contact_number: editingCandidate.contact_number ?? '',
        slot_availability: editingCandidate.slot_availability ?? '',
        rate_card_hourly: editingCandidate.rate_card_hourly ?? 0,
        experience_years: editingCandidate.experience_years ?? 0,
        visa_type: editingCandidate.visa_type ?? '',
        willing_to_relocate: editingCandidate.willing_to_relocate ?? false,
        overall_gpt_score: editingCandidate.overall_gpt_score ?? 0,
        notice_period_days: editingCandidate.notice_period_days ?? 0,
        cv_file_url: editingCandidate.cv_file_url ?? '',
        remarks: editingCandidate.remarks ?? '',
      });
    }
  }, [editingCandidate]);

  React.useEffect(() => {
    fetchJobPosts()
      .then((data) => {
        if (Array.isArray(data)) {
          const normalized = (data as unknown[])
            .map((item) => {
              if (item && typeof item === 'object' && 'id' in (item as Record<string, unknown>)) {
                const it = item as Record<string, unknown>;
                return { id: Number(it.id), title: String(it.title ?? it.id) };
              }
              return null;
            })
            .filter((x): x is { id: number; title: string } => x !== null);
          setJobPosts(normalized);
        }
      })
      .catch((err: unknown) => {
        // non-fatal for the form; still allow manual entry via select empty state
        console.error('Failed to fetch job posts for select', err);
      });
  }, []);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<unknown>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name } = target;
    const { value } = target as { value: unknown };
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string | number>) => {
    const { name, value } = e.target as { name: string; value: string | number };
    if (name === 'job_post_id') {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const payload: Record<string, unknown> = {
        job_post_id: Number(form.job_post_id),
        name: form.name,
        current_location: form.current_location,
        email: form.email,
        contact_number: form.contact_number,
        slot_availability: form.slot_availability, // expect ISO datetime
        rate_card_hourly: Number(form.rate_card_hourly),
        experience_years: Number(form.experience_years),
        visa_type: form.visa_type,
        willing_to_relocate: Boolean(form.willing_to_relocate),
        overall_gpt_score: Number(form.overall_gpt_score),
        notice_period_days: Number(form.notice_period_days),
        cv_file_url: form.cv_file_url,
        remarks: form.remarks,
      };
      if (editingCandidate && editingCandidate.id) {
        await updateCandidate(Number(editingCandidate.id), payload);
        setSnackbar({ open: true, message: 'Candidate updated', severity: 'success' });
      } else {
        await createCandidate(payload);
        setSnackbar({ open: true, message: 'Candidate created', severity: 'success' });
      }
      setTimeout(() => navigate('/candidates'), 600);
    } catch (err: unknown) {
      console.error('Create/update candidate failed', err);
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
        Add Candidate
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <FormControl fullWidth margin="normal">
          <InputLabel id="job-post-select-label">Job Post</InputLabel>
          <Select
            labelId="job-post-select-label"
            label="Job Post"
            name="job_post_id"
            value={form.job_post_id}
            onChange={handleSelectChange}
          >
            <MenuItem value={0}>
              <em>None</em>
            </MenuItem>
            {jobPosts.map((jp) => (
              <MenuItem key={jp.id} value={jp.id}>
                {jp.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Current Location"
          name="current_location"
          value={form.current_location}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Contact Number"
          name="contact_number"
          value={form.contact_number}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Slot Availability (ISO datetime)"
          name="slot_availability"
          value={form.slot_availability}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Rate Card (Hourly)"
          name="rate_card_hourly"
          value={String(form.rate_card_hourly)}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Experience (Years)"
          name="experience_years"
          value={String(form.experience_years)}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="visa-type-label">Visa Type</InputLabel>
          <Select
            labelId="visa-type-label"
            label="Visa Type"
            name="visa_type"
            value={form.visa_type}
            onChange={handleSelectChange}
          >
            <MenuItem value="h1b">H1B</MenuItem>
            <MenuItem value="l1">L1</MenuItem>
            <MenuItem value="f1">F1</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          label="Willing to Relocate (true/false)"
          name="willing_to_relocate"
          value={String(form.willing_to_relocate)}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="GPT Score"
          name="overall_gpt_score"
          value={String(form.overall_gpt_score)}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Notice Period Days"
          name="notice_period_days"
          value={String(form.notice_period_days)}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="CV File URL"
          name="cv_file_url"
          value={form.cv_file_url}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Remarks"
          name="remarks"
          value={form.remarks}
          onChange={handleChange}
          multiline
          rows={3}
        />
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {editingCandidate ? 'Update' : 'Create'}
          </Button>
          <Button variant="outlined" onClick={() => navigate('/candidates')}>
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

export default AddCandidate;
