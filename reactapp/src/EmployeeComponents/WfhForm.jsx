import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import './WfhForm.css';
import { wfhAPI } from '../apiConfig';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

// MUI Date Picker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toast } from 'react-toastify';

const WfhForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.wfhRequest;
  const isEditMode = !!editData;

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    status: 'Pending'
  });

  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (editData) {
      setFormData({
        startDate: editData.startDate ? editData.startDate.split('T')[0] : '',
        endDate: editData.endDate ? editData.endDate.split('T')[0] : '',
        reason: editData.reason || '',
        status: editData.status || 'Pending'
      });
    }
  }, [editData]);

  const getTodayDate = () => {
    const today = new Date();
    return today;
  };

  // Create mutation
  const createWfhMutation = useMutation(
    (data) => wfhAPI.addWfhRequest(data),
    {
      onSuccess: () => {
        try {
          const userId = localStorage.getItem('userId');
          queryClient.invalidateQueries(['wfhRequests', userId]);
        } catch (e) { }
        setShowSuccessModal(true);
      },
      onError: (error) => {
        console.error('Error creating WFH request:', error);
        toast.error('Failed to submit WFH request. Please try again.');
      }
    }
  );

  // Update mutation
  const updateWfhMutation = useMutation(
    (data) => wfhAPI.updateWfhRequest(editData._id, data),
    {
      onSuccess: () => {
        try {
          const userId = localStorage.getItem('userId');
          queryClient.invalidateQueries(['wfhRequests', userId]);
        } catch (e) { }
        setShowSuccessModal(true);
      },
      onError: (error) => {
        console.error('Error updating WFH request:', error);
        toast.error('Failed to update WFH request. Please try again.');
      }
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.startDate) newErrors.startDate = 'Start Date is required';
    if (!formData.endDate) newErrors.endDate = 'End Date is required';
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const userId = localStorage.getItem('userId');
    const requestData = { ...formData, userId };

    if (isEditMode) {
      updateWfhMutation.mutate(requestData);
    } else {
      createWfhMutation.mutate(requestData);
    }
  };

  const handleModalOk = () => {
    setShowSuccessModal(false);
    navigate('/employee/wfh/history');
  };

  const handleBack = () => {
    navigate('/employee/wfh/history');
  };

  // Inside your component, before the return
  let buttonLabel;
  if (createWfhMutation.isLoading || updateWfhMutation.isLoading) {
    buttonLabel = "Submitting...";
  } else if (isEditMode) {
    buttonLabel = "Update Request";
  } else {
    buttonLabel = "Add Request";
  }

  return (
    <Container maxWidth="sm" className="wfh-form-container">
      <Paper elevation={3} className="wfh-form-card">
        <Typography variant="h4" component="h2" className="wfh-form-title">
          {isEditMode ? 'Edit WFH Request' : 'Apply WFH Request'}
        </Typography>

        <p style={{ display: 'none' }}>Logout</p>

        <Box component="form" onSubmit={handleSubmit} className="wfh-form" noValidate>
          <Grid container spacing={3}>
            {/* Start Date */}
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date *"
                  minDate={getTodayDate()}
                  value={formData.startDate ? new Date(formData.startDate) : null}
                  onChange={(newValue) => {
                    if (!newValue) {
                      setFormData(prev => ({ ...prev, startDate: '' }));
                      if (errors.startDate) {
                        setErrors(prev => ({ ...prev, startDate: '' }));
                      }
                      return;
                    }
                    const year = newValue.getFullYear();
                    const month = String(newValue.getMonth() + 1).padStart(2, '0');
                    const day = String(newValue.getDate()).padStart(2, '0');
                    setFormData(prev => ({
                      ...prev,
                      startDate: `${year}-${month}-${day}`
                    }));
                    if (errors.startDate) {
                      setErrors(prev => ({ ...prev, startDate: '' }));
                    }
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.startDate,
                      helperText: errors.startDate,
                      className: 'wfh-textfield'
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* End Date */}
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date *"
                  minDate={formData.startDate ? new Date(formData.startDate) : getTodayDate()}
                  value={formData.endDate ? new Date(formData.endDate) : null}
                  onChange={(newValue) => {
                    if (!newValue) {
                      setFormData(prev => ({ ...prev, endDate: '' }));
                      if (errors.endDate) {
                        setErrors(prev => ({ ...prev, endDate: '' }));
                      }
                      return;
                    }
                    const year = newValue.getFullYear();
                    const month = String(newValue.getMonth() + 1).padStart(2, '0');
                    const day = String(newValue.getDate()).padStart(2, '0');
                    setFormData(prev => ({
                      ...prev,
                      endDate: `${year}-${month}-${day}`
                    }));
                    if (errors.endDate) {
                      setErrors(prev => ({ ...prev, endDate: '' }));
                    }
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.endDate,
                      helperText: errors.endDate,
                      className: 'wfh-textfield'
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* Reason */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason *"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="Enter reason for WFH request"
                error={!!errors.reason}
                helperText={errors.reason}
                className="wfh-textfield"
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box className="form-buttons-wfh">
                {isEditMode && (
                  <Button
                    variant="outlined"
                    className="btn-back-wfh"
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  className="btn-submit-wfh"
                  disabled={createWfhMutation.isLoading || updateWfhMutation.isLoading}
                  startIcon={<SendIcon />}
                >
                  {buttonLabel}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Success Dialog */}
      <Dialog
        open={showSuccessModal}
        onClose={handleModalOk}
        className="success-dialog-wfh"
        PaperProps={{
          className: 'success-dialog-paper-wfh'
        }}
      >
        <DialogTitle className="success-dialog-title-wfh">
          <Box className="dialog-title-content-success-wfh">
            <CheckCircleIcon className="success-icon-wfh" />
            <Typography variant="h6" component="span">
              Success!
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={handleModalOk}
            className="close-button-success-wfh"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="success-dialog-content-wfh">
          <Typography className="dialog-text-success-wfh">
            WFH request {isEditMode ? 'updated' : 'submitted'} successfully.
          </Typography>
        </DialogContent>
        <DialogActions className="success-dialog-actions-wfh">
          <Button
            onClick={handleModalOk}
            className="btn-ok-wfh"
            variant="contained"
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WfhForm;