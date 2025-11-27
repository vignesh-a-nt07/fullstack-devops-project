import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const Dashboard: React.FC = () => {
  return (
    <>
      <title>Dashboard | HireHub ATS</title>
      <meta
        name="description"
        content="View insights and manage your recruitment process on the HireHub ATS Dashboard."
      />

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }} color="primary" gutterBottom>
          Dashboard
        </Typography>
        <Paper elevation={3} sx={{ p: 5, borderRadius: 3, bgcolor: 'background.paper' }}>
          <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
            Welcome to HireHub ATS Dashboard!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Select a menu item from the sidebar to get started.
          </Typography>
        </Paper>
      </Container>
    </>
  );
};

export default Dashboard;
