import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import './EmployeeNavbar.css';
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
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const EmployeeNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [wfhAnchorEl, setWfhAnchorEl] = useState(null);
  const [leaveAnchorEl, setLeaveAnchorEl] = useState(null);

  const userName = localStorage.getItem('userName') || 'Employee';
  const role = localStorage.getItem('role') || 'Employee';

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    setShowLogoutModal(false);
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleWfhClick = (event) => {
    setWfhAnchorEl(event.currentTarget);
  };

  const handleWfhClose = () => {
    setWfhAnchorEl(null);
  };

  const handleLeaveClick = (event) => {
    setLeaveAnchorEl(event.currentTarget);
  };

  const handleLeaveClose = () => {
    setLeaveAnchorEl(null);
  };

  const isWfhActive = location.pathname.includes('/employee/wfh');
  const isLeaveActive = location.pathname.includes('/employee/leave');

  return (
    <>
      <AppBar position="sticky" className="employee-navbar-mui">
        <Container maxWidth="xl">
          <Toolbar disableGutters className="navbar-toolbar">
            {/* Brand */}
            <Typography
              variant="h5"
              component={Link}
              to="/employee/home"
              className="navbar-brand-mui"
            >
              WorkBuddy
            </Typography>

            {/* Navigation Menu */}
            <Box className="navbar-menu-mui">
              <Button
                component={Link}
                to="/employee/home"
                className={`nav-link-btn ${location.pathname === '/employee/home' ? 'active' : ''}`}
              >
                Home
              </Button>

              {/* WFH Dropdown */}
              <Box className="dropdown-wrapper">
                <Button
                  className={`nav-link-btn dropdown-btn ${isWfhActive ? 'active' : ''}`}
                  onClick={handleWfhClick}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  WFH
                </Button>
                <Menu
                  anchorEl={wfhAnchorEl}
                  open={Boolean(wfhAnchorEl)}
                  onClose={handleWfhClose}
                  className="dropdown-menu-mui"
                  PaperProps={{
                    className: 'dropdown-paper'
                  }}
                >
                  <MenuItem
                    component={Link}
                    to="/employee/wfh/apply"
                    onClick={handleWfhClose}
                    className="dropdown-item"
                  >
                    Apply WFH
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/employee/wfh/history"
                    onClick={handleWfhClose}
                    className="dropdown-item"
                  >
                    My WFH History
                  </MenuItem>
                </Menu>
              </Box>

              {/* Leave Dropdown */}
              <Box className="dropdown-wrapper">
                <Button
                  className={`nav-link-btn dropdown-btn ${isLeaveActive ? 'active' : ''}`}
                  onClick={handleLeaveClick}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  Leave
                </Button>
                <Menu
                  anchorEl={leaveAnchorEl}
                  open={Boolean(leaveAnchorEl)}
                  onClose={handleLeaveClose}
                  className="dropdown-menu-mui"
                  PaperProps={{
                    className: 'dropdown-paper'
                  }}
                >
                  <MenuItem
                    component={Link}
                    to="/employee/leave/apply"
                    onClick={handleLeaveClose}
                    className="dropdown-item"
                  >
                    Apply Leave
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/employee/leave/history"
                    onClick={handleLeaveClose}
                    className="dropdown-item"
                  >
                    My Leave History
                  </MenuItem>
                </Menu>
              </Box>
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
                onClick={handleLogout}
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
        onClose={cancelLogout}
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
            onClick={cancelLogout}
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
            onClick={cancelLogout}
            className="btn-cancel-mui"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmLogout}
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

export default EmployeeNavbar;