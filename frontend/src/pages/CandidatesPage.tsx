import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { fetchCandidates } from '../api/auth';

interface Candidate {
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
  id: number;
  created_at: string;
}

const CandidatesPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // error state kept for potential future display; currently only snackbar is used
  const [, setError] = useState<string>('');
  type SnackbarState = { open: boolean; message: string; severity: 'error' | 'success' };
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'error',
  });

  useEffect(() => {
    fetchCandidates(0, 10)
      .then((data) => {
        setCandidates(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error('Failed to fetch candidates', err);
        setError('Failed to fetch candidates');
        setSnackbar({
          open: true,
          message: (err as Error)?.message || 'Failed to fetch candidates',
          severity: 'error',
        });
        setLoading(false);
      });
  }, []);

  const navigate = useNavigate();
  const goToAdd = () => navigate('/candidates/add');

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <>
      <title>Candidate | HireHub ATS</title>
      <meta name="description" content="View insights and manage candidate on the HireHub ATS." />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }} color="primary" gutterBottom>
            Candidates
          </Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={goToAdd}>
            Add Candidate
          </Button>
        </Box>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Job Post ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Current Location</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Contact Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Slot Availability</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Rate Card (Hourly)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Experience (Years)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Visa Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Willing to Relocate</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>GPT Score</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Notice Period (Days)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>CV</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Remarks</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>{candidate.job_post_id}</TableCell>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>{candidate.current_location}</TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>{candidate.contact_number}</TableCell>
                    <TableCell>
                      {candidate.slot_availability
                        ? new Date(candidate.slot_availability).toLocaleString()
                        : ''}
                    </TableCell>
                    <TableCell>{candidate.rate_card_hourly}</TableCell>
                    <TableCell>{candidate.experience_years}</TableCell>
                    <TableCell>{candidate.visa_type}</TableCell>
                    <TableCell>{candidate.willing_to_relocate ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{candidate.overall_gpt_score}</TableCell>
                    <TableCell>{candidate.notice_period_days}</TableCell>
                    <TableCell>
                      <a href={candidate.cv_file_url} target="_blank" rel="noopener noreferrer">
                        CV
                      </a>
                    </TableCell>
                    <TableCell>{candidate.remarks}</TableCell>
                    <TableCell>
                      {candidate.created_at ? new Date(candidate.created_at).toLocaleString() : ''}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => navigate('/candidates/add', { state: { candidate } })}
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

export default CandidatesPage;
