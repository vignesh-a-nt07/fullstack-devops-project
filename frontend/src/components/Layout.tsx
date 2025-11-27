import React from 'react';
import Sidebar from '../components/Sidebar';
import Box from '@mui/material/Box';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
    </Box>
  );
};

export default Layout;
