import React from 'react';
import { getUserRole } from '../utils/auth';
import HirehubLogo from '../assets/navat-logo.svg';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { NavLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material';
import { useThemeMode } from '../providers/themeContext';

const getMenuItems = () => {
  const items = [
    { label: 'Dashboard', href: '/' },
    { label: 'Job Posts', href: '/jobposts' },
    { label: 'Candidate List', href: '/candidates' },
    { label: 'Configurations', href: '/settings' },
  ];
  if (getUserRole() === 'admin') {
    items.push({ label: 'User Management', href: '/users' });
  }
  return items;
};

const handleLogout = () => {
  sessionStorage.removeItem('session_token');
  window.location.href = '/';
};

const Sidebar: React.FC = () => {
  const menuItems = getMenuItems();
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();

  return (
    <Box
      sx={{
        width: 260,
        minHeight: '100vh',
        bgcolor: theme.palette.primary.main,
        boxShadow: 2,
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        position: 'relative',
        zIndex: 10,
      }}
      className="border-end"
    >
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <img
          src={HirehubLogo}
          alt="HireHub Logo"
          style={{ width: 120, height: 90, marginBottom: 8 }}
        />
        <div
          className="fw-bold"
          style={{ fontSize: '1.2rem', color: theme.palette.primary.contrastText }}
        >
          HireHub ATS
        </div>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
      <nav aria-label="sidebar menu">
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton sx={{ borderRadius: 2 }}>
                <NavLink
                  to={item.href}
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    color: isActive ? theme.palette.primary.contrastText : 'rgba(255,255,255,0.85)',
                    fontWeight: isActive ? 'bold' : 'normal',
                    width: '100%',
                    display: 'block',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: isActive ? theme.palette.primary.dark : 'transparent',
                  })}
                >
                  {item.label}
                </NavLink>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mt: 2, borderRadius: 2, fontWeight: 'bold' }}
          onClick={handleLogout}
        >
          Logout
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <IconButton onClick={toggleMode} sx={{ color: '#fff' }} aria-label="toggle theme">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </nav>
      <Divider sx={{ mt: 3 }} />
      <Box
        sx={{ textAlign: 'center', pt: 2, color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}
      >
        &copy; 2025 HireHub ATS. All rights reserved.
      </Box>
    </Box>
  );
};

export default Sidebar;
