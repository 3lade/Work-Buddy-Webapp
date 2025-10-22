import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading, setUser, setError } from '../userSlice';
import { userAPI } from '../apiConfig';
import { toast } from 'react-toastify';
import './Login.css';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link as MuiLink
} from '@mui/material';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.passwordField) {
      newErrors.passwordField = 'Password is required';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fill all required fields correctly');
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    dispatch(setLoading(true));

    try {
      const response = await userAPI.login({
        email: formData.email,
        password: formData.passwordField
      });

      const { userName, role, token, id } = response.data;

      dispatch(setUser({
        token,
        role,
        id,
        userName
      }));

      toast.success(`Welcome back, ${userName}!`);

      if (role === 'Employee') {
        navigate('/employee/home');
      } else if (role === 'Manager') {
        navigate('/manager/home');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <Box className="login-page">
      <Box className="login-left-section">
        <Typography variant="h1" className="login-title">
          WorkBuddy
        </Typography>
        <Typography className="login-subtitle">
          Success at work is a journey, and the first step is managing your tasks effectively.
        </Typography>
      </Box>

      <Box className="login-right-section">
        <Paper component="form" onSubmit={handleSubmit} className="login-form-container">
          <Typography variant="h2" className="login-form-title">
            Login
          </Typography>

          <TextField
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            error={!!errors.email}
            className="login-textfield"
          />
          {errors.email && <Typography className="login-error-text">{errors.email}</Typography>}

          <TextField
            type="password"
            name="passwordField"
            placeholder="Password"
            value={formData.passwordField}
            onChange={handleChange}
            variant="outlined"
            error={!!errors.passwordField}
            className="login-textfield"
          />
          {errors.passwordField && <Typography className="login-error-text">{errors.passwordField}</Typography>}

          <Button 
            type="submit" 
            variant="contained" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging...' : 'Login'}
          </Button>

          <Box className="login-signup-link-container">
            Don't have an account?{' '}
            <MuiLink component={Link} to="/signup" className="login-signup-link">
              Signup
            </MuiLink>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;