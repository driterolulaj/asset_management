// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', { username, password }, { withCredentials: true });
      login(res.data.token, res.data.user, res.data.expiresIn);
      navigate('/assets');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={8}>
      <Paper elevation={3} sx={{ p: 4, width: 300 }}>
        <Typography variant="h6" gutterBottom>Login</Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={e => setUsername(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={e => setPassword(e.target.value)}
            margin="normal"
          />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
