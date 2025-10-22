import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import "./LeaveForm.css";
import { leaveAPI } from "../apiConfig";
import { toast } from 'react-toastify'

import {
  Paper,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const LeaveForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.leaveRequest;
  const isEditMode = !!editData;

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
    leaveType: "",
    file: null,
    fileName: "",
    status: "Pending",
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (editData) {
      setFormData({
        startDate: editData.startDate ? editData.startDate.split("T")[0] : "",
        endDate: editData.endDate ? editData.endDate.split("T")[0] : "",
        reason: editData.reason || "",
        leaveType: editData.leaveType || "",
        file: editData.file || null,
        fileName: editData.fileName || "",
        status: editData.status || "Pending",
      });
    }
  }, [editData]);

  const createLeaveMutation = useMutation(
    (data) => leaveAPI.addLeaveRequest(data),
    {
      onSuccess: () => {
        try {
          queryClient.invalidateQueries("leaveRequests");
        } catch (e) { }
        setShowSuccessModal(true);
      },
      onError: (error) => {
        console.error("Error creating leave request:", error);
        toast.error("Failed to submit leave request. Please try again.");
      },
    }
  );

  const updateLeaveMutation = useMutation(
    (data) => leaveAPI.updateLeaveRequest(editData.id || editData._id, data),
    {
      onSuccess: () => {
        try {
          queryClient.invalidateQueries("leaveRequests");
        } catch (e) { }
        setShowSuccessModal(true);
      },
      onError: (error) => {
        console.error("Error updating leave request:", error);
        toast.error("Failed to update leave request. Please try again.");
      },
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, file: "File size must be less than 5MB" }));
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        file: "Only PDF, DOC, DOCX, JPG, JPEG, PNG files are allowed",
      }));
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      setFormData((prev) => ({
        ...prev,
        file: base64,
        fileName: file.name,
      }));

      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(url);
      } else if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      if (errors.file) {
        setErrors((prev) => ({ ...prev, file: "" }));
      }
    } catch (error) {
      console.error("Error converting file to base64:", error);
      setErrors((prev) => ({ ...prev, file: "Failed to process file" }));
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        try {
          URL.revokeObjectURL(previewUrl);
        } catch (e) { }
      }
    };
  }, [previewUrl]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.startDate) newErrors.startDate = "Start Date is required";
    if (!formData.endDate) newErrors.endDate = "End Date is required";
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = "End Date must be after Start Date";
      }
    }
    if (!formData.reason.trim()) newErrors.reason = "Reason is required";
    if (!formData.leaveType) newErrors.leaveType = "Leave Type is required";
    if (!formData.file) newErrors.file = "File is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const userId = localStorage.getItem("userId");
    const requestData = { ...formData, userId };

    if (isEditMode) {
      updateLeaveMutation.mutate(requestData);
    } else {
      createLeaveMutation.mutate(requestData);
    }
  };

  const handleModalOk = () => {
    setShowSuccessModal(false);
    navigate("/employee/leave/history");
  };

  const handleBack = () => {
    navigate("/employee/leave/history");
  };

  let buttonLabel;
  if (createLeaveMutation.isLoading || updateLeaveMutation.isLoading) {
    buttonLabel = "Submitting...";
  } else if (isEditMode) {
    buttonLabel = "Update Request";
  } else {
    buttonLabel = "Add Request";
  }

  return (
    <Box className="leave-form-container">
      <Paper className="leave-form-card" elevation={3}>
        <Typography variant="h4" component="h2" className="leave-form-title">
          {isEditMode ? "Edit Leave Request" : "Apply Leave Request"}
        </Typography>

        <form onSubmit={handleSubmit} noValidate className="leave-form">
          <Grid container spacing={3}>

            {/* Start Date */}
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date *"
                  minDate={new Date()} //date picker expects a Date object
                  value={formData.startDate ? new Date(formData.startDate) : null}
                  onChange={(newValue) => {
                    if (!newValue) {
                      setFormData(prev => ({ ...prev, startDate: "" }));
                      return;
                    }
                    const year = newValue.getFullYear();
                    const month = String(newValue.getMonth() + 1).padStart(2, "0");
                    const day = String(newValue.getDate()).padStart(2, "0");
                    setFormData(prev => ({
                      ...prev,
                      startDate: `${year}-${month}-${day}`
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.startDate}
                      helperText={errors.startDate}
                      className="leave-textfield"
                    />
                  )}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.startDate,
                      helperText: errors.startDate,
                      className: "leave-textfield"
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
                  minDate={formData.startDate ? new Date(formData.startDate) : new Date()}
                  value={formData.endDate ? new Date(formData.endDate) : null}
                  onChange={(newValue) => {
                    if (!newValue) {
                      setFormData(prev => ({ ...prev, endDate: "" }));
                      return;
                    }
                    const year = newValue.getFullYear();
                    const month = String(newValue.getMonth() + 1).padStart(2, "0");
                    const day = String(newValue.getDate()).padStart(2, "0");
                    setFormData(prev => ({
                      ...prev,
                      endDate: `${year}-${month}-${day}`
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.endDate}
                      helperText={errors.endDate}
                      className="leave-textfield"
                    />
                  )}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.endDate,
                      helperText: errors.endDate,
                      className: "leave-textfield"
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* Reason */}
            <Grid item xs={12}>
              <TextField
                label="Reason *"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                error={!!errors.reason}
                helperText={errors.reason}
                placeholder="Enter reason for leave request"
                className="leave-textfield"
              />
            </Grid>

            {/* Leave Type */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.leaveType} className="leave-textfield">
                <InputLabel id="leave-type-label">Leave Type *</InputLabel>
                <Select
                  labelId="leave-type-label"
                  label="Leave Type *"
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                >
                  <MenuItem value="">Select Leave Type</MenuItem>
                  <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                  <MenuItem value="Casual Leave">Casual Leave</MenuItem>
                  <MenuItem value="Earned Leave">Earned Leave</MenuItem>
                  <MenuItem value="Maternity Leave">Maternity Leave</MenuItem>
                  <MenuItem value="Paternity Leave">Paternity Leave</MenuItem>
                </Select>
                {errors.leaveType && (
                  <Typography variant="caption" color="error" className="error-helper-text">
                    {errors.leaveType}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* File Upload */}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                className="upload-btn-leave"
                startIcon={<UploadFileIcon />}
              >
                {formData.fileName
                  ? `Selected: ${formData.fileName}`
                  : "Upload File *"}
                <input
                  type="file"
                  name="file"
                  hidden
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </Button>
              {errors.file && (
                <Typography variant="caption" color="error" display="block" className="error-helper-text">
                  {errors.file}
                </Typography>
              )}
              {/* Image preview for selected image files */}
              {previewUrl ? (
                <Box className="preview-container">
                  <img
                    src={previewUrl}
                    alt="Selected preview"
                    className="preview-image"
                  />
                  <Typography variant="caption" display="block" className="preview-label">
                    Preview
                  </Typography>
                </Box>
              ) : (
                formData.fileName && (
                  <Typography variant="caption" display="block" className="file-name-display">
                    Selected file: {formData.fileName}
                  </Typography>
                )
              )}
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box className="form-buttons-leave">
                {isEditMode && (
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    className="btn-back-leave"
                    startIcon={<ArrowBackIcon />}
                  >
                    Back
                  </Button>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  disabled={
                    createLeaveMutation.isLoading || updateLeaveMutation.isLoading
                  }
                  className="btn-submit-leave"
                  startIcon={<SendIcon />}
                >
                  {buttonLabel}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        {/* Success Dialog */}
        <Dialog
          open={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          className="success-dialog-leave"
          PaperProps={{
            className: 'success-dialog-paper-leave'
          }}
        >
          <DialogTitle className="success-dialog-title-leave">
            <Box className="dialog-title-content-success-leave">
              <CheckCircleIcon className="success-icon-leave" />
              <Typography variant="h6" component="span">
                Success!
              </Typography>
            </Box>
            <IconButton
              aria-label="close"
              onClick={() => setShowSuccessModal(false)}
              className="close-button-success-leave"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className="success-dialog-content-leave">
            <Typography className="dialog-text-success-leave">
              Leave request {isEditMode ? "updated" : "submitted"} successfully.
            </Typography>
          </DialogContent>
          <DialogActions className="success-dialog-actions-leave">
            <Button
              onClick={handleModalOk}
              variant="contained"
              className="btn-ok-leave"
              autoFocus
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default LeaveForm;