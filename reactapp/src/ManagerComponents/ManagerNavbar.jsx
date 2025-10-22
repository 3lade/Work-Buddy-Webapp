import React, { useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import './ManagerNavbar.css';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Avatar
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const ManagerNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userName] = useState(localStorage.getItem('userName') || 'Manager');
  const [role] = useState(localStorage.getItem('role') || 'Manager');

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <>
      <AppBar position="sticky" className="manager-navbar-mui">
        <Container maxWidth="xl">
          <Toolbar disableGutters className="navbar-toolbar">
            {/* Brand */}
            <Typography
              variant="h5"
              component={Link}
              to="/manager/home"
              className="navbar-brand-mui"
            >
              WorkBuddy
            </Typography>

            {/* Navigation Menu */}
            <Box className="navbar-menu-mui">
              <Button
                component={Link}
                to="/manager/home"
                className={`nav-link-btn ${location.pathname === '/manager/home' ? 'active' : '' }`}
              >
                Home
              </Button>
              <Button
                component={Link}
                to="/manager/employees"
                className={`nav-link-btn ${location.pathname === '/manager/employees' ? 'active' : '' }`}
              >
                Employees
              </Button>
              <Button
                component={Link}
                to="/manager/wfh-requests"
                className={`nav-link-btn ${location.pathname === '/manager/wfh-requests' ? 'active' : '' }`}
              >
                WFH Request
              </Button>
              <Button
                component={Link}
                to="/manager/leave-requests"
                className={`nav-link-btn ${location.pathname === '/manager/leave-requests' ? 'active' : '' }`}
              >
                Leave Request
              </Button>
            </Box>

            {/* Right Section - User Info & Logout */}
            <Box className="navbar-right-mui">
              <Box className="user-info-mui">
                <Avatar className="user-avatar">
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
                <Box className="user-details">
                  <Typography variant="body1" className="user-name">
                    {userName}
                  </Typography>
                  <Typography variant="body2" className="user-role">
                    {role}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                className="logout-btn-mui"
                onClick={() => setShowLogoutModal(true)}
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* This is critical - renders child routes */}
      <Outlet />

      {/* Logout Modal */}
      <Dialog
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        className="logout-dialog"
        PaperProps={{
          className: 'logout-dialog-paper'
        }}
      >
        <DialogTitle className="dialog-title">
          <Box className="dialog-title-content">
            <WarningAmberIcon className="warning-icon" />
            <Typography variant="h6" component="span">
              Confirm Logout
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={() => setShowLogoutModal(false)}
            className="close-button"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="dialog-content">
          <DialogContentText className="dialog-text">
            Are you sure you want to logout? You will need to sign in again to access your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button
            onClick={() => setShowLogoutModal(false)}
            className="btn-cancel-mui"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            className="btn-logout-mui"
            variant="contained"
            startIcon={<LogoutIcon />}
            autoFocus
          >
            Yes, Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManagerNavbar;