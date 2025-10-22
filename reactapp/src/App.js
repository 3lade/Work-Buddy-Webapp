import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import PrivateRoute from './Components/PrivateRoute';

// Components
import Login from './Components/Login';
import Signup from './Components/Signup';
import ErrorPage from './Components/ErrorPage';
import HomePage from './Components/HomePage';

// Employee Components
import EmployeeNavbar from './EmployeeComponents/EmployeeNavbar';
import WfhForm from './EmployeeComponents/WfhForm';
import ViewWfh from './EmployeeComponents/ViewWfh';
import LeaveForm from './EmployeeComponents/LeaveForm';
import ViewLeave from './EmployeeComponents/ViewLeave';

// Manager Components
import ManagerNavbar from './ManagerComponents/ManagerNavbar';
import EmployeeList from './ManagerComponents/EmployeeList';
import WfhRequest from './ManagerComponents/WfhRequest';
import LeaveRequest from './ManagerComponents/LeaveRequest';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable automatic refetching when window regains focus
      retry: 1, // Only retry failed queries once
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      cacheTime: 30 * 60 * 1000, // Cache data for 30 minutes
    },
    mutations: {
      retry: 1, // Only retry failed mutations once
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/error" element={<ErrorPage />} />

          {/* Employee Routes */}
          <Route
            path="/employee"
            element={
              <PrivateRoute allowedRoles={["Employee"]}>
                <EmployeeNavbar />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/employee/home" replace />} />
            <Route path="home" element={<HomePage />} />
            <Route path="wfh/apply" element={<WfhForm />} />
            <Route path="wfh/history" element={<ViewWfh />} />
            <Route path="leave/apply" element={<LeaveForm />} />
            <Route path="leave/history" element={<ViewLeave />} />
          </Route>

          {/* Manager Routes */}
          <Route
            path="/manager"
            element={
              <PrivateRoute allowedRoles={["Manager"]}>
                <ManagerNavbar />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/manager/home" replace />} />
            <Route path="home" element={<HomePage />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="wfh-requests" element={<WfhRequest />} />
            <Route path="leave-requests" element={<LeaveRequest />} />
          </Route>

          {/* Catch all - redirect to error page */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;