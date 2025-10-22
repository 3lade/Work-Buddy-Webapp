import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { leaveAPI } from "../apiConfig";
import "./LeaveRequest.css";
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
  CircularProgress,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Pagination,
  Grid,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const LeaveRequest = () => {
  const queryClient = useQueryClient();
  const [searchReason, setSearchReason] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 5;

  const token = localStorage.getItem("token");

  // Determine if we need pagination based on filters or sorting
  const hasFilters = searchReason || filterStatus || sortOrder;

  const { data, isLoading } = useQuery(
    ["managerLeaveRequests", currentPage, searchReason, filterStatus, sortOrder],
    async () => {
      // Always use pagination params
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (searchReason) {
        params.search = searchReason;
      }

      if (filterStatus) {
        params.status = filterStatus;
      }

      if (sortOrder && sortOrder.trim() !== '') {
        params.sort = sortOrder;
      }

      const response = await leaveAPI.getAllLeaveRequests(params);
      return response.data;
    },
    {
      enabled: !!token,
      keepPreviousData: true,
      onError: (error) => {
        console.error("Error fetching leave requests:", error);
      },
    }
  );

  // Handle paginated data from backend
  const leaveRequests = data?.allLeaveRequests || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalItems || 0;

  const approveMutation = useMutation(
    (id) => leaveAPI.updateLeaveRequest(id, { status: "Approved" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["managerLeaveRequests"]);
      },
      onError: (error) => {
        console.error("Error approving leave request:", error);
        alert("Failed to approve leave request. Please try again.");
      },
    }
  );

  const rejectMutation = useMutation(
    (id) => leaveAPI.updateLeaveRequest(id, { status: "Rejected" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["managerLeaveRequests"]);
      },
      onError: (error) => {
        console.error("Error rejecting leave request:", error);
        alert("Failed to reject leave request. Please try again.");
      },
    }
  );

  const handleApprove = (id) => {
    approveMutation.mutate(id);
  };

  const handleReject = (id) => {
    rejectMutation.mutate(id);
  };

  const handleShowMore = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
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
    setSearchReason(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
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

  let tableContent;
  if (isLoading) {
    tableContent = (
      <TableRow>
        <TableCell colSpan={7} className="loading-cell-leave">
          <Box className="loading-container-leave">
            <CircularProgress sx={{ color: '#0b1b2b' }}/>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Loading requests...
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
    );
  } else if (leaveRequests && leaveRequests.length === 0) {
    tableContent = (
      <TableRow>
        <TableCell colSpan={7}>
          <Box className="no-data-leave">
            <Typography variant="body1" color="text.secondary">
              No leave requests found.
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
    );
  } else {
    tableContent = leaveRequests.map((request) => (
      <TableRow
        key={request._id}
        className="table-row-leave"
        sx={{
          '&:hover': { backgroundColor: '#f5f5f5' }
        }}
      >
        <TableCell>{request.userId?.userName || "N/A"}</TableCell>
        <TableCell>{formatDate(request.startDate)}</TableCell>
        <TableCell>{formatDate(request.endDate)}</TableCell>
        <TableCell>{request.reason}</TableCell>
        <TableCell>{request.leaveType}</TableCell>
        <TableCell>
          <Chip
            label={request.status}
            color={getStatusColor(request.status)}
            size="small"
            className="status-chip-leave"
          />
        </TableCell>
        <TableCell>
          <Box className="action-buttons-leave">
            {request.status === "Pending" && (
              <>
                <Button
                  variant="contained"
                  size="small"
                  className="approve-btn-leave"
                  onClick={() => handleApprove(request._id)}
                  disabled={approveMutation.isLoading}
                  startIcon={<CheckCircleIcon />}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  className="reject-btn-leave"
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
              className="showmore-btn-leave"
              onClick={() => handleShowMore(request)}
              startIcon={<InfoIcon />}
            >
              Details
            </Button>
          </Box>
        </TableCell>
      </TableRow>
    ));
  }

  return (
    <Container maxWidth="xl" className="leave-request-container">
      <Typography variant="h4" component="h1" className="leave-request-heading">
        Leave Requests for Approval
      </Typography>

      <Box className="controls-container-leave">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by reason..."
          value={searchReason}
          onChange={handleSearchChange}
          className="search-input-leave"
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
          }}
        />

        <p style={{ display: 'none' }}>Logout</p>
        
        <FormControl fullWidth variant="outlined" className="filter-select-leave">
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={filterStatus}
            onChange={handleFilterChange}
            label="Status Filter"
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {hasFilters && totalItems > 0 && (
        <Box className="results-info-leave">
          <Typography variant="body2" color="text.secondary">
            Showing {leaveRequests.length} of {totalItems} results
          </Typography>
        </Box>
      )}

      <TableContainer component={Paper} elevation={3} className="table-container-leave">
        <Table sx={{ minWidth: 650 }} aria-label="leave requests table">
          <TableHead>
            <TableRow className="table-header-leave">
              <TableCell className="table-header-cell-leave">Employee Name</TableCell>
              <TableCell className="table-header-cell-leave">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  Start Date
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleSort('asc')}
                      className={`sort-btn-leave ${sortOrder === 'asc' ? 'active' : ''}`}
                      title="Sort Ascending (Oldest First)"
                    >
                      <ArrowUpwardIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleSort('desc')}
                      className={`sort-btn-leave ${sortOrder === 'desc' ? 'active' : ''}`}
                      title="Sort Descending (Newest First)"
                    >
                      <ArrowDownwardIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                  </Box>
                </Box>
              </TableCell>
              <TableCell className="table-header-cell-leave">End Date</TableCell>
              <TableCell className="table-header-cell-leave">Reason</TableCell>
              <TableCell className="table-header-cell-leave">Leave Type</TableCell>
              <TableCell className="table-header-cell-leave">Status</TableCell>
              <TableCell className="table-header-cell-leave">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableContent}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box className="pagination-container-leave">
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
        className="leave-dialog"
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: 'leave-dialog-paper'
        }}
      >
        <DialogTitle className="leave-dialog-title">
          <Box className="dialog-title-content-leave">
            <InfoIcon className="info-icon-leave" />
            <Typography variant="h6" component="span">
              Leave Request Details
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            className="close-button-leave"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="leave-dialog-content">
          {selectedRequest && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box className="modal-detail-leave">
                  <Typography variant="subtitle2" className="modal-label-leave">
                    Employee Name:
                  </Typography>
                  <Typography variant="body1" className="modal-value-leave">
                    {selectedRequest.userId?.userName || "N/A"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box className="modal-detail-leave">
                  <Typography variant="subtitle2" className="modal-label-leave">
                    Email:
                  </Typography>
                  <Typography variant="body1" className="modal-value-leave">
                    {selectedRequest.userId?.email || "N/A"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box className="modal-detail-leave">
                  <Typography variant="subtitle2" className="modal-label-leave">
                    Start Date:
                  </Typography>
                  <Typography variant="body1" className="modal-value-leave">
                    {formatDate(selectedRequest.startDate)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box className="modal-detail-leave">
                  <Typography variant="subtitle2" className="modal-label-leave">
                    End Date:
                  </Typography>
                  <Typography variant="body1" className="modal-value-leave">
                    {formatDate(selectedRequest.endDate)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box className="modal-detail-leave">
                  <Typography variant="subtitle2" className="modal-label-leave">
                    Reason:
                  </Typography>
                  <Typography variant="body1" className="modal-value-leave">
                    {selectedRequest.reason}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box className="modal-detail-leave">
                  <Typography variant="subtitle2" className="modal-label-leave">
                    Leave Type:
                  </Typography>
                  <Typography variant="body1" className="modal-value-leave">
                    {selectedRequest.leaveType}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box className="modal-detail-leave">
                  <Typography variant="subtitle2" className="modal-label-leave">
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
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid item xs={12}>
                <Box className="modal-detail-leave">
                  <Typography variant="subtitle2" className="modal-label-leave">
                    <AttachFileIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Attachment:
                  </Typography>
                  <Box className="modal-value-leave" sx={{ mt: 1 }}>
                    {(() => {
                      if (!selectedRequest.file) {
                        return (
                          <Typography variant="body2" color="text.secondary">
                            No file attached
                          </Typography>
                        );
                      }
                      if (selectedRequest.file?.startsWith('data:image/')) {
                        return (
                          <img
                            src={selectedRequest.file}
                            alt="Attachment"
                            className="attachment-image"
                          />
                        );
                      }
                      return (
                        <Button
                          variant="outlined"
                          size="small"
                          href={selectedRequest.file}
                          target="_blank"
                          rel="noreferrer"
                          startIcon={<AttachFileIcon />}
                          className="attachment-link-leave"
                        >
                          View Attachment
                        </Button>
                      );
                    })()}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box className="modal-detail-leave">
                  <Typography variant="subtitle2" className="modal-label-leave">
                    Created On:
                  </Typography>
                  <Typography variant="body1" className="modal-value-leave">
                    {formatDate(selectedRequest.createdOn)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="leave-dialog-actions">
          {selectedRequest && selectedRequest.status === "Pending" && (
            <>
              <Button
                onClick={() => handleApprove(selectedRequest._id)}
                className="approve-btn-modal-leave"
                variant="contained"
                startIcon={<CheckCircleIcon />}
                disabled={approveMutation.isLoading}
              >
                Approve
              </Button>
              <Button
                onClick={() => handleReject(selectedRequest._id)}
                className="reject-btn-modal-leave"
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
            className="close-btn-modal-leave"
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LeaveRequest;