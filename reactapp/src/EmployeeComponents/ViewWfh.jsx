import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import './ViewWfh.css';
import { wfhAPI } from '../apiConfig';
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

const ViewWfh = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const itemsPerPage = 5;

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  const { data, isLoading, isFetching, isError, error } = useQuery(
    ['wfhRequests', userId, currentPage, debouncedSearchTerm, filterStatus],
    async () => {
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

      const response = await wfhAPI.getWfhRequestsByUser(userId, params);
      return response.data;
    },
    {
      enabled: !!userId && !!token,
      keepPreviousData: true,
      retry: 1,
      onError: (error) => {
        console.error('Error fetching WFH requests:', error);
      }
    }
  );

  const wfhRequests = data?.wfhRequests || data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalItems || 0;
  const currentPageData = data?.currentPage || currentPage;

  // Delete mutation
  const deleteWfhMutation = useMutation(
    (id) => wfhAPI.deleteWfhRequest(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['wfhRequests', userId]);
        setDeleteModalOpen(false);
        setDeleteId(null);
      },
      onError: (error) => {
        console.error('Error deleting WFH request:', error);
        toast.error('Failed to delete WFH request. Please try again.');
      }
    }
  );

  const handleEdit = (request) => {
    navigate('/employee/wfh/apply', { state: { wfhRequest: request } });
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteWfhMutation.mutate(deleteId);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
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
      <Container maxWidth="xl" className="view-wfh-container">
        <Typography variant="h5" color="error" align="center">
          Error: {error.message}
        </Typography>
      </Container>
    );
  }

  const renderWfhTableContent = () => {
    if (isLoading || (isFetching && wfhRequests.length === 0)) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="loading-cell-view-wfh">
            <Box className="loading-container-view-wfh">
              <CircularProgress sx={{ color: '#0b1b2b' }}/>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Loading requests...
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
      );
    }

    if (wfhRequests.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5}>
            <Box className="no-data-view-wfh">
              <Typography variant="body1" color="text.secondary">
                No WFH requests found.
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
      );
    }

    return wfhRequests.map((request) => (
      <TableRow
        key={request._id}
        className="table-row-view-wfh"
        sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
      >
        <TableCell>{formatDate(request.startDate)}</TableCell>
        <TableCell>{formatDate(request.endDate)}</TableCell>
        <TableCell>{request.reason}</TableCell>
        <TableCell>
          <Chip
            label={request.status}
            color={getStatusColor(request.status)}
            size="small"
            className="status-chip-view-wfh"
          />
        </TableCell>
        <TableCell>
          {request.status === "Pending" && (
            <Box className="action-buttons-view-wfh">
              <Button
                variant="contained"
                size="small"
                className="edit-btn-view-wfh"
                onClick={() => handleEdit(request)}
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                size="small"
                className="delete-btn-view-wfh"
                onClick={() => handleDeleteClick(request._id)}
                disabled={deleteWfhMutation.isLoading}
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
    <Container maxWidth="xl" className="view-wfh-container">
      <Typography variant="h4" component="h1" className="view-wfh-heading">
        Work From Home Requests
      </Typography>

      <p style={{ display: 'none' }}>Logout</p>

      {/* Filters */}
      <Box className="controls-container-view-wfh">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by reason..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input-view-wfh"
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
          }}
        />

        <FormControl fullWidth variant="outlined" className="filter-select-view-wfh">
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
        <Box className="results-info-view-wfh">
          <Typography variant="body2" color="text.secondary">
            Showing {wfhRequests.length} of {totalItems} results
          </Typography>
        </Box>
      )}

      {/* Fetching indicator */}
      {isFetching && wfhRequests.length > 0 && (
        <Box className="fetching-indicator-view-wfh">
          <Typography variant="body2" color="primary">
            Updating...
          </Typography>
        </Box>
      )}

      {/* Table */}
      <TableContainer component={Paper} elevation={3} className="table-container-view-wfh">
        <Table sx={{ minWidth: 650 }} aria-label="wfh requests table">
          <TableHead>
            <TableRow className="table-header-view-wfh">
              <TableCell className="table-header-cell-view-wfh">Start Date</TableCell>
              <TableCell className="table-header-cell-view-wfh">End Date</TableCell>
              <TableCell className="table-header-cell-view-wfh">Reason</TableCell>
              <TableCell className="table-header-cell-view-wfh">Status</TableCell>
              <TableCell className="table-header-cell-view-wfh">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderWfhTableContent()}</TableBody>
        </Table>
      </TableContainer>

     
      {totalPages > 1 && wfhRequests.length > 0 && (
        <Box className="pagination-container-view-wfh" sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
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
        className="delete-dialog-view-wfh"
        PaperProps={{
          className: 'delete-dialog-paper-view-wfh'
        }}
      >
        <DialogTitle className="delete-dialog-title-view-wfh">
          <Box className="dialog-title-content-view-wfh">
            <WarningAmberIcon className="warning-icon-view-wfh" />
            <Typography variant="h6" component="span">
              Confirm Delete
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={handleDeleteCancel}
            className="close-button-view-wfh"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="delete-dialog-content-view-wfh">
          <DialogContentText className="dialog-text-view-wfh">
            Are you sure you want to delete this WFH request? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="delete-dialog-actions-view-wfh">
          <Button
            onClick={handleDeleteCancel}
            className="btn-cancel-view-wfh"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            className="btn-confirm-view-wfh"
            variant="contained"
            startIcon={<DeleteIcon />}
            disabled={deleteWfhMutation.isLoading}
            autoFocus
          >
            {deleteWfhMutation.isLoading ? 'Deleting...' : 'Yes, Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewWfh;

