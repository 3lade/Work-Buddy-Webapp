
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading, setError } from '../userSlice';
import { userAPI } from '../apiConfig';
import { toast } from 'react-toastify';
import './Signup.css';
import {
  Card,
  CardContent,
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  Link as MuiLink
} from '@mui/material';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

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
    const tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username.trim()) {
      tempErrors.username = 'User Name is required';
    }

    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Invalid email';
    }

    if (!formData.mobileNumber) {
      tempErrors.mobileNumber = 'Mobile Number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      tempErrors.mobileNumber = 'Mobile number must be 10 digits';
    }

    if (!formData.password) {
      tempErrors.password = 'Password is required';
    }

    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      tempErrors.role = 'Role is required';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    dispatch(setLoading(true));

    try {
      await userAPI.signup({
        userName: formData.username,
        email: formData.email,
        mobile: formData.mobileNumber,
        password: formData.password,
        role: formData.role
      });

      dispatch(setLoading(false));
      toast.success('Registration successful! Redirecting to login...');
      setShowModal(true);
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      dispatch(setLoading(false));
    }
  };

  const handleModalOk = () => {
    setShowModal(false);
    navigate('/login');
  };

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showModal, navigate]);

  return (
    <Box className="signup-container">
      <Container maxWidth="sm">
        <Card elevation={4} className="signup-card">
          <CardContent className="signup-card-content">
            <Typography variant="h4" component="h2" className="signup-title">
              Signup
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate className="signup-form">
              <TextField
                fullWidth
                label="User Name"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                required
                margin="normal"
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
                margin="normal"
              />

              <TextField
                fullWidth
                label="Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber}
                required
                margin="normal"
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                required
                margin="normal"
              />

              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder='Confirm Password'
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
                margin="normal"
              />

              <FormControl
                fullWidth
                margin="normal"
                error={!!errors.role}
                required
              >
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Role"
                >
                  <MenuItem value="" disabled>
                    Select Role
                  </MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Employee">Employee</MenuItem>
                </Select>
                {errors.role && (
                  <FormHelperText>{errors.role}</FormHelperText>
                )}
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                className="signup-submit-btn"
              >
                Submit
              </Button>

              <Box className="signup-link-container">
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <MuiLink
                    component={Link}
                    to="/login"
                    underline="hover"
                    className="signup-link"
                  >
                    Login
                  </MuiLink>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Dialog open={showModal} onClose={handleModalOk} maxWidth="xs" fullWidth>
        <DialogTitle className="signup-dialog-title">
          Registration Successful!
        </DialogTitle>
        <DialogContent className="signup-dialog-content">
          <Typography>Your account has been created.</Typography>
        </DialogContent>
        <DialogActions className="signup-dialog-actions">
          <Button onClick={handleModalOk} variant="contained" className="signup-dialog-btn">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Signup;
