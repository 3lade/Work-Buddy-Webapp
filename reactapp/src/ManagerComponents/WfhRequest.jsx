import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { wfhAPI } from '../apiConfig';
import "./WfhRequest.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Container,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Pagination,
  Grid,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { toast } from "react-toastify";

const WfhRequest = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 5;

  const token = localStorage.getItem("token");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Query for fetching WFH requests with backend pagination, search, and filter
  const { data, isLoading } = useQuery(
    ["managerWfhRequests", currentPage, debouncedSearchTerm, statusFilter, sortOrder],
    async () => {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (debouncedSearchTerm && debouncedSearchTerm.trim() !== '') {
        params.search = debouncedSearchTerm;
      }

      if (statusFilter && statusFilter.trim() !== '') {
        params.status = statusFilter;
      }

      if (sortOrder && sortOrder.trim() !== '') {
        params.sort = sortOrder;
      }

      const response = await wfhAPI.getAllWfhRequests(params);
      return response.data;
    },
    {
      enabled: !!token,
      keepPreviousData: true,
      onError: (error) => {
        console.error("Error fetching WFH requests:", error);
      }
    }
  );

  // Extract data from response
  const wfhRequests = Array.isArray(data?.allWfhRequests) ? data.allWfhRequests : [];
  const totalPages = data?.totalPages || 1;

  // Approve mutation
  const approveMutation = useMutation(
    (id) => wfhAPI.updateWfhRequest(id, { status: "Approved" }),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(["managerWfhRequests"]);
        if (showModal) {
          handleCloseModal();
        }
      },
      onError: (error) => {
        console.error("Error approving WFH request:", error);
        toast.error("Failed to approve WFH request. Please try again.");
      }
    }
  );

  // Reject mutation
  const rejectMutation = useMutation(
    (id) => wfhAPI.updateWfhRequest(id, { status: "Rejected" }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["managerWfhRequests"], { refetchActive: true, refetchInactive: true });
        await queryClient.refetchQueries(["managerWfhRequests"], { active: true });
        queryClient.invalidateQueries(["managerWfhRequests"]);
        if (showModal) {
          handleCloseModal();
        }
      },
      onError: (error) => {
        console.error("Error rejecting WFH request:", error);
        toast.error("Failed to reject WFH request. Please try again.");
      }
    }
  );

  const handleApprove = (id) => {
    approveMutation.mutate(id);
  };

  const handleReject = (id) => {
    rejectMutation.mutate(id);
  };

  const handleShowMore = async (requestId) => {
    try {
      const response = await wfhAPI.getWfhRequestById(requestId);
      setSelectedRequest(response.data);
      setShowModal(true);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching WFH request by ID:", error);
      toast.error("Failed to fetch request details");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (order) => {
    setSortOrder(order);
    setCurrentPage(1);
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

  const renderWfhTableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={6}>
            <Box
              className="loading-wfh"
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}
            >
              <CircularProgress sx={{ color: '#0b1b2b' }} />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Loading requests...
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
      );
    }
  
    if (wfhRequests.length > 0) {
      return wfhRequests.map((request) => (
        <TableRow
          key={request._id}
          className="table-row-wfh"
          sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
        >
          <TableCell>{request.userId?.userName || request.userName || "N/A"}</TableCell>
          <TableCell>{formatDate(request.startDate)}</TableCell>
          <TableCell>{formatDate(request.endDate)}</TableCell>
          <TableCell>{request.reason}</TableCell>
          <TableCell>
            <Chip
              label={request.status}
              color={getStatusColor(request.status)}
              size="small"
              className="status-chip"
            />
          </TableCell>
          <TableCell>
            <Box className="action-buttons-wfh">
              {request.status === "Pending" && (
                <>
                  <Button
                    variant="contained"
                    size="small"
                    className="approve-btn-wfh"
                    onClick={() => handleApprove(request._id)}
                    disabled={approveMutation.isLoading}
                    startIcon={<CheckCircleIcon />}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    className="reject-btn-wfh"
                    onClick={() => handleReject(request._id)}
                    disabled={rejectMutation.isLoading}
                    startIcon={<CancelIcon />}
                  >
                    Reject
                  </Button>
                </>
              )}
              <Button
                variant="outlined"
                size="small"
                className="showmore-btn-wfh"
                onClick={() => handleShowMore(request._id)}
                startIcon={<InfoIcon />}
              >
                Show More
              </Button>
            </Box>
          </TableCell>
        </TableRow>
      ));
    }
  
    return (
      <TableRow>
        <TableCell colSpan={6}>
          <Box className="no-data-wfh">
            <Typography variant="body1" color="text.secondary">
              No WFH requests found
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Container maxWidth="xl" className="wfh-container">
      <Typography variant="h4" component="h1" className="wfh-heading">
        WFH Requests for Approval
      </Typography>

      <Box className="controls-container-wfh">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by reason..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input-wfh"
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
          }}
        />
        <FormControl fullWidth variant="outlined" className="filter-select-wfh">
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Status Filter"
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <p style={{ display: 'none' }}>Logout</p>

      <TableContainer component={Paper} elevation={3} className="table-container-wfh">
        <Table sx={{ minWidth: 650 }} aria-label="wfh requests table">
          <TableHead>
            <TableRow className="table-header-wfh">
              <TableCell className="table-header-cell-wfh">Employee Name</TableCell>
              <TableCell className="table-header-cell-wfh">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  Start Date
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleSort('asc')}
                      className={`sort-btn-wfh ${sortOrder === 'asc' ? 'active' : ''}`}
                      title="Sort Ascending (Oldest First)"
                    >
                      <ArrowUpwardIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleSort('desc')}
                      className={`sort-btn-wfh ${sortOrder === 'desc' ? 'active' : ''}`}
                      title="Sort Descending (Newest First)"
                    >
                      <ArrowDownwardIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                  </Box>
                </Box>
              </TableCell>
              <TableCell className="table-header-cell-wfh">End Date</TableCell>
              <TableCell className="table-header-cell-wfh">Reason</TableCell>
              <TableCell className="table-header-cell-wfh">Status</TableCell>
              <TableCell className="table-header-cell-wfh">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {renderWfhTableContent()}
          </TableBody>

        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box className="pagination-container-wfh">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            size="large"
          />
        </Box>
      )}

      {/* Details Modal */}
      <Dialog
        open={showModal}
        onClose={handleCloseModal}
        className="wfh-dialog"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          className: 'wfh-dialog-paper'
        }}
      >
        <DialogTitle className="wfh-dialog-title">
          <Box className="dialog-title-content-wfh">
            <InfoIcon className="info-icon-wfh" />
            <Typography variant="h6" component="span">
              WFH Request Details
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            className="close-button-wfh"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="wfh-dialog-content">
          {selectedRequest && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box className="modal-detail-wfh">
                  <Typography variant="subtitle2" className="modal-label-wfh">
                    Employee Name:
                  </Typography>
                  <Typography variant="body1" className="modal-value-wfh">
                    {selectedRequest.userId?.userName || selectedRequest.userName || "N/A"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box className="modal-detail-wfh">
                  <Typography variant="subtitle2" className="modal-label-wfh">
                    Start Date:
                  </Typography>
                  <Typography variant="body1" className="modal-value-wfh">
                    {formatDate(selectedRequest.startDate)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box className="modal-detail-wfh">
                  <Typography variant="subtitle2" className="modal-label-wfh">
                    End Date:
                  </Typography>
                  <Typography variant="body1" className="modal-value-wfh">
                    {formatDate(selectedRequest.endDate)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box className="modal-detail-wfh">
                  <Typography variant="subtitle2" className="modal-label-wfh">
                    Reason:
                  </Typography>
                  <Typography variant="body1" className="modal-value-wfh">
                    {selectedRequest.reason}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box className="modal-detail-wfh">
                  <Typography variant="subtitle2" className="modal-label-wfh">
                    Status:
                  </Typography>
                  <Chip
                    label={selectedRequest.status}
                    color={getStatusColor(selectedRequest.status)}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box className="modal-detail-wfh">
                  <Typography variant="subtitle2" className="modal-label-wfh">
                    Created On:
                  </Typography>
                  <Typography variant="body1" className="modal-value-wfh">
                    {formatDate(selectedRequest.createdOn)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="wfh-dialog-actions">
          {selectedRequest && selectedRequest.status === "Pending" && (
            <>
              <Button
                onClick={() => handleApprove(selectedRequest._id)}
                className="approve-btn-modal-wfh"
                variant="contained"
                startIcon={<CheckCircleIcon />}
                disabled={approveMutation.isLoading}
              >
                Approve
              </Button>
              <Button
                onClick={() => handleReject(selectedRequest._id)}
                className="reject-btn-modal-wfh"
                variant="contained"
                startIcon={<CancelIcon />}
                disabled={rejectMutation.isLoading}
              >
                Reject
              </Button>
            </>
          )}
          <Button
            onClick={handleCloseModal}
            className="close-btn-modal-wfh"
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WfhRequest;