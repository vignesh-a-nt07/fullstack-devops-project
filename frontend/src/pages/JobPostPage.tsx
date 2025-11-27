import React, { useEffect, useState } from 'react';
import { fetchJobPosts } from '../api/auth';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface JobPost {
  title: string;
  company_intro: string;
  position: string;
  location: string;
  employment_type: string;
  department: string;
  position_summary: string;
  key_responsibilities: string[];
  required_qualifications: string[];
  preferred_qualifications: string[];
  addons: Record<string, unknown>;
  why_join_us: string;
  id: number;
  created_at: string;
}

const JobPostPage: React.FC = () => {
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  // error state reserved; snackbar used for user-visible messages
  const [, setError] = useState<string>('');
  type SnackbarState = { open: boolean; message: string; severity: 'error' | 'success' };
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'error',
  });

  useEffect(() => {
    fetchJobPosts()
      .then((data) => {
        setJobPosts(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error('Failed to fetch job posts', err);
        setError('Failed to fetch job posts');
        setSnackbar({
          open: true,
          message: (err as Error)?.message || 'Failed to fetch job posts',
          severity: 'error',
        });
        setLoading(false);
      });
  }, []);

  const goToAdd = () => navigate('/jobposts/add');

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <>
      <title>Job Posts | HireHub ATS</title>
      <meta name="description" content="View and manage job posts on the HireHub ATS." />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }} color="primary" gutterBottom>
            Job Posts
          </Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={goToAdd}>
            Add Job
          </Button>
        </Box>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Company Intro</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Position</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Employment Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Position Summary</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Key Responsibilities</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Required Qualifications</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Preferred Qualifications</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Addons</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Why Join Us</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobPosts.map((job, idx) => (
                  <TableRow key={job.id || idx}>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.company_intro}</TableCell>
                    <TableCell>{job.position}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.employment_type}</TableCell>
                    <TableCell>{job.department}</TableCell>
                    <TableCell>{job.position_summary}</TableCell>
                    <TableCell>
                      {Array.isArray(job.key_responsibilities)
                        ? job.key_responsibilities.join(', ')
                        : job.key_responsibilities}
                    </TableCell>
                    <TableCell>
                      {Array.isArray(job.required_qualifications)
                        ? job.required_qualifications.join(', ')
                        : job.required_qualifications}
                    </TableCell>
                    <TableCell>
                      {Array.isArray(job.preferred_qualifications)
                        ? job.preferred_qualifications.join(', ')
                        : job.preferred_qualifications}
                    </TableCell>
                    <TableCell>{job.addons ? JSON.stringify(job.addons) : ''}</TableCell>
                    <TableCell>{job.why_join_us}</TableCell>
                    <TableCell>
                      {job.created_at ? new Date(job.created_at).toLocaleString() : ''}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => navigate('/jobposts/add', { state: { job } })}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
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

export default JobPostPage;
