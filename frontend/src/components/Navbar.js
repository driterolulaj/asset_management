// 18. src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const hideNavbarOnLogin = location.pathname === '/login';

  if (hideNavbarOnLogin) return null;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>Asset Tracker</Typography>
        {user && (
          <>
            <Button color="inherit" component={Link} to="/assets">Assets</Button>
            <Button color="inherit" component={Link} to="/models">Models</Button>
            {user.role === 'superadmin' && (
              <Button color="inherit" component={Link} to="/users">Users</Button>
            )}
            <Button color="inherit" onClick={logout}>Logout</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;