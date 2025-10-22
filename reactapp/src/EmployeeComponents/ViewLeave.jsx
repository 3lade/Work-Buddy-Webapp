import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import './ViewLeave.css';
import { leaveAPI } from '../apiConfig';
import {
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Pagination,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';

const ViewLeave = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const itemsPerPage = 5;

  const userId = typeof window !== 'undefined' ? window.localStorage.getItem('userId') : null;
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 when filter status changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  // Fetch leave requests
  const { data, isLoading, isFetching, isError, error } = useQuery(
    ['leaveRequests', userId, currentPage, debouncedSearchTerm, filterStatus],
    async () => {
      console.log('Fetching Leave requests:', {
        userId,
        page: currentPage,
        search: debouncedSearchTerm,
        status: filterStatus,
      });

      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (debouncedSearchTerm && debouncedSearchTerm.trim() !== '') {
        params.search = debouncedSearchTerm;
      }

      if (filterStatus && filterStatus !== '') {
        params.status = filterStatus;
      }

      console.log('Query params:', params);
      const response = await leaveAPI.getLeaveRequestsByUser(userId, params);
      console.log('Leave Response:', response);
      return response.data; // Return response.data to match backend structure
    },
    {
      enabled: !!userId && !!token,
      keepPreviousData: true,
      retry: 1,
      onError: (error) => {
        console.error('Error fetching Leave requests:', error);
      },
    }
  );

  // Handle paginated and non-paginated data
  const leaveRequests = data?.leaveRequests || data || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalItems || leaveRequests.length;
  const currentPageData = data?.currentPage || currentPage;

  // Delete mutation
  const deleteLeaveMutation = useMutation(
    (id) => leaveAPI.deleteLeaveRequest(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['leaveRequests', userId]);
        setDeleteModalOpen(false);
        setDeleteId(null);
      },
      onError: (error) => {
        console.error('Error deleting Leave request:', error);
        toast.error(error.message || 'Failed to delete Leave request. Please try again.');
      },
    }
  );

  const handleEdit = (request) => {
    navigate('/employee/leave/apply', { state: { leaveRequest: request } });
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteLeaveMutation.mutate(deleteId);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date) ? 'N/A' : date.toLocaleDateString('en-GB');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (isError) {
    return (
      <Container maxWidth="xl" className="view-leave-container">
        <Typography variant="h5" color="error" align="center">
          Error: {error.message}
        </Typography>
      </Container>
    );
  }

  // Helper function inside your component
  const renderTableContent = () => {
    if (isLoading || (isFetching && leaveRequests.length === 0)) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="loading-cell-view-leave">
            <Box className="loading-container-view-leave">
              <CircularProgress sx={{ color: '#0b1b2b' }} />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Loading requests...
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
      );
    }

    if (leaveRequests.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6}>
            <Box className="no-data-view-leave">
              <Typography variant="body1" color="text.secondary">
                No Leave requests found.
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
      );
    }

    return leaveRequests.map((request) => (
      <TableRow
        key={request._id}
        className="table-row-view-leave"
        sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
      >
        <TableCell>{formatDate(request.startDate)}</TableCell>
        <TableCell>{formatDate(request.endDate)}</TableCell>
        <TableCell>{request.reason || "N/A"}</TableCell>
        <TableCell>{request.leaveType || "N/A"}</TableCell>
        <TableCell>
          <Chip
            label={request.status || "Unknown"}
            color={getStatusColor(request.status)}
            size="small"
            className="status-chip-view-leave"
          />
        </TableCell>
        <TableCell>
          {request.status === "Pending" && (
            <Box className="action-buttons-view-leave">
              <Button
                variant="contained"
                size="small"
                className="edit-btn-view-leave"
                onClick={() => handleEdit(request)}
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                size="small"
                className="delete-btn-view-leave"
                onClick={() => handleDeleteClick(request._id)}
                disabled={deleteLeaveMutation.isLoading}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </Box>
          )}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Container maxWidth="xl" className="view-leave-container">
      <Typography variant="h4" component="h1" className="view-leave-heading">
        Leave Requests
      </Typography>

      {/* Filters */}
      <Box className="controls-container-view-leave">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by reason..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input-view-leave"
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
          }}
        />

        <p style={{ display: 'none' }}>Logout</p>

        <FormControl fullWidth variant="outlined" className="filter-select-view-leave">
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Status Filter"
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Results info */}
      {!isLoading && totalItems > 0 && (
        <Box className="results-info-view-leave">
          <Typography variant="body2" color="text.secondary">
            Showing {leaveRequests.length} of {totalItems} results
          </Typography>
        </Box>
      )}

      {/* Fetching indicator */}
      {isFetching && leaveRequests.length > 0 && (
        <Box className="fetching-indicator-view-leave">
          <Typography variant="body2">
            Updating...
          </Typography>
        </Box>
      )}

      {/* Table */}
      <TableContainer component={Paper} elevation={3} className="table-container-view-leave">
        <Table sx={{ minWidth: 650 }} aria-label="leave requests table">
          <TableHead>
            <TableRow className="table-header-view-leave">
              <TableCell className="table-header-cell-view-leave">Start Date</TableCell>
              <TableCell className="table-header-cell-view-leave">End Date</TableCell>
              <TableCell className="table-header-cell-view-leave">Reason</TableCell>
              <TableCell className="table-header-cell-view-leave">Leave Type</TableCell>
              <TableCell className="table-header-cell-view-leave">Status</TableCell>
              <TableCell className="table-header-cell-view-leave">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderTableContent()}
          </TableBody>
        </Table>
      </TableContainer>


      {totalPages > 1 && leaveRequests.length > 0 && (
        <Box className="pagination-container-view-leave" sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={currentPageData}
              onChange={(event, value) => setCurrentPage(value)}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Stack>
        </Box>
      )}

      {/* Delete Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        className="delete-dialog-view-leave"
        PaperProps={{
          className: 'delete-dialog-paper-view-leave'
        }}
      >
        <DialogTitle className="delete-dialog-title-view-leave">
          <Box className="dialog-title-content-view-leave">
            <WarningAmberIcon className="warning-icon-view-leave" />
            <Typography variant="h6" component="span">
              Confirm Delete
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={handleDeleteCancel}
            className="close-button-view-leave"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="delete-dialog-content-view-leave">
          <DialogContentText className="dialog-text-view-leave">
            Are you sure you want to delete this Leave request? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="delete-dialog-actions-view-leave">
          <Button
            onClick={handleDeleteCancel}
            className="btn-cancel-view-leave"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            className="btn-confirm-view-leave"
            variant="contained"
            startIcon={<DeleteIcon />}
            disabled={deleteLeaveMutation.isLoading}
            autoFocus
          >
            {deleteLeaveMutation.isLoading ? 'Deleting...' : 'Yes, Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewLeave;
