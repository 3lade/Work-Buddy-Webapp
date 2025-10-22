import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { userAPI } from '../apiConfig';
import './EmployeeList.css';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Pagination,
  Container,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const EmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isFetching, isError, error } = useQuery(
    ['allEmployees', debouncedSearchTerm, currentPage],
    async () => {
      const response = await userAPI.getAllEmployees(
        debouncedSearchTerm,
        currentPage,
        itemsPerPage
      );
      return response;
    },
    {
      retry: 1,
      keepPreviousData: true
    }
  );

  const employees = data?.employees || [];
  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalEmployees: 0
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (isError) {
    return (
      <Container maxWidth="lg" className="employee-container">
        <Alert severity="error">{error.message}</Alert>
      </Container>
    );
  }

  const renderEmployeeContent = () => {
    if (isLoading) {
      return (
        <Box className="loading-container">
          <CircularProgress sx={{ color: '#0b1b2b' }} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading employees...
          </Typography>
        </Box>
      );
    }

    if (employees.length === 0) {
      return (
        <Paper elevation={2} className="no-data-paper">
          <Typography variant="body1" color="text.secondary">
            No employees found.
          </Typography>
        </Paper>
      );
    }

    return (
      <>
        {isFetching && (
          <Box className="fetching-indicator">
            <CircularProgress size={20} sx={{ mr: 1, color: '#0b1b2b' }} />
            <Typography variant="body2">Updating...</Typography>
          </Box>
        )}

        <TableContainer component={Paper} elevation={3} className="table-container-mui">
          <Table sx={{ minWidth: 650 }} aria-label="employee table">
            <TableHead>
              <TableRow className="table-header-mui">
                <TableCell className="table-header-cell">Employee Name</TableCell>
                <TableCell className="table-header-cell">Email</TableCell>
                <TableCell className="table-header-cell">Mobile Number</TableCell>
                <TableCell className="table-header-cell">Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow
                  key={employee._id}
                  className="table-row-mui"
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                >
                  <TableCell>{employee.userName}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.mobile}</TableCell>
                  <TableCell>
                    <span className="role-badge">{employee.role}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box className="pagination-container-mui">
          <Pagination
            count={pagination.totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            disabled={isFetching}
            showFirstButton
            showLastButton
            size="large"
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Total Employees: {pagination.totalEmployees}
          </Typography>
        </Box>
      </>
    );
  };

  return (
    <Container maxWidth="lg" className="employee-container">
      <Typography variant="h4" component="h1" className="employee-heading">
        Employee Directory
      </Typography>

      <Box className="controls-container">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
          }}
          className="search-input-mui"
        />
      </Box>

      {renderEmployeeContent()}
    </Container>
  );
};

export default EmployeeList;