# 🏢 Work Buddy WebApp

<div align="center">

![Work Buddy Banner](https://github.com/3lade/Work-Buddy-Webapp/blob/4f420721982a8ef513c93fe2d752d96c3cc7035a/ss/Screenshot%202025-10-23%20121623.png)

[![Node.js](https://img.shields.io/badge/node-v18.x-brightgreen.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/react-v18.2.0-blue.svg)](https://reactjs.org)
[![Material-UI](https://img.shields.io/badge/Material--UI-v5.14.11-0081CB.svg)](https://mui.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v6.6.6-4EA94B.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-v4.18.2-000000.svg)](https://expressjs.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

*A modern, intuitive employee leave & WFH management system*

[Features](#-features) • [Quick Start](#-quick-start) • [API Reference](#-api-reference) • [Contributing](#-contributing)

</div>

## 🌟 Overview

Work Buddy WebApp streamlines employee leave and work-from-home (WFH) request management with an elegant, user-friendly interface. Perfect for modern teams embracing flexible work arrangements.

### 🎯 Who's it for?

<table>
<tr>
<td width="33%">
<h4>👥 Employees</h4>
• Submit leave requests<br>
• Request WFH days<br>
• Track request status<br>
• View history
</td>
<td width="33%">
<h4>👔 Managers</h4>
• Review requests<br>
• Approve/reject<br>
• Team dashboard<br>
• Request analytics
</td>
<td width="33%">
<h4>🛠 Developers</h4>
• Extensible codebase<br>
• Modern stack<br>
• Easy customization<br>
• Well-structured
</td>
</tr>
</table>

## 🎨 Interface Previews

<div align="center">
<table>
<tr>
<td width="33%">

### 📱 Modern Login
![Login Screen](https://github.com/3lade/Work-Buddy-Webapp/blob/e3cf105d9c742f0ba07aa23caf15fb798243b2a9/ss/Screenshot%202025-10-23%20115701.png)
- Material-UI Paper components
- Clean form layout
- Error handling with toast
</td>
<td width="33%">

### 📋 Leave Request UI
![Leave Form](https://github.com/3lade/Work-Buddy-Webapp/blob/5adf34085ccc3105710ded98d522173ff8162c12/ss/Screenshot%202025-10-23%20120008.png)
- Date range pickers
- Type selection
- Reason field with validation
</td>
<td width="33%">

### 📊 Manager Dashboard
![Manager View](https://github.com/3lade/Work-Buddy-Webapp/blob/62d94c22bdbcb72694e73cc357713d806339fa61/ss/Screenshot%202025-10-23%20115826.png)
- Request summary cards
- Tabbed interface
- Quick action buttons
</td>
</tr>
</table>
</div>

> 💡 The interface uses Material-UI's Paper, Card, and Grid components for a consistent, modern look across all views.

## ✨ Features

<table>
<tr>
<td width="50%">

### 💼 For Employees
- **Material UI Forms** - Beautiful leave/WFH forms with date pickers
- **Real-time Status** - Toast notifications for updates
- **Request History** - Tabulated view of all requests
- **Smart Navigation** - Clean navbar with quick actions

</td>
<td width="50%">

### 👑 For Managers
- **Request Dashboard** - Material UI cards with request details
- **Quick Actions** - One-click approve/reject with notifications
- **Employee Directory** - Grid view of team members
- **Dual View** - Separate leave and WFH request management

</td>
</tr>
</table>

### 🛠 Technical Features

<table>
<tr>
<td width="50%">

### 🔒 Authentication & Security
- JWT-based authentication
- Protected routes with `PrivateRoute` component
- Secure password handling with bcrypt
- Role-based access control (Employee/Manager)

</td>
<td width="50%">

### 💫 Modern Stack & UI
- Material-UI v5 components
- Redux Toolkit for state management
- React Query for data fetching
- React Toastify for notifications

</td>
</tr>
</table>

## 🚀 Quick Start

### Prerequisites

- Node.js v18.x or higher
- npm v9.x or higher
- MongoDB (local or Atlas)

### Backend Setup

```powershell
# Navigate to backend
cd ".\nodeapp"

# Install dependencies
npm install

# Start the server (uses nodemon)
npm start
```

### Frontend Setup

```powershell
# Navigate to frontend
cd ".\reactapp"

# Install dependencies
npm install

# Launch dev server (opens on port 8081)
npm start
```

## 🏗 Project Structure

```
📦 Work Buddy WebApp
├── 📂 nodeapp/
│   ├── 📄 index.js            # Server entry
│   ├── 📂 controllers/        # Request handlers
│   ├── 📂 models/            # Database schemas
│   ├── 📂 routers/           # API routes
│   └── 📄 authUtils.js       # Auth helpers
│
└── 📂 reactapp/
    ├── 📂 src/
    │   ├── 📂 Components/     # Shared components
    │   ├── 📂 EmployeeComponents/
    │   ├── 📂 ManagerComponents/
    │   └── 📄 App.js         # Main component
    └── 📄 package.json
```

## ⚙️ Environment Setup

### Backend Configuration

Create a `.env` file in the `nodeapp` directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/workbuddy
JWT_SECRET=your-secure-jwt-secret
NODE_ENV=development
```

### Frontend Configuration

1. The app uses `apiConfig.js` for backend connectivity:

```javascript
export const API_BASE_URL = 'http://localhost:3000/api';
export const userAPI = `${API_BASE_URL}/users`;
export const leaveAPI = `${API_BASE_URL}/leave`;
export const wfhAPI = `${API_BASE_URL}/wfh`;
```

2. Key dependencies (already in package.json):

Backend:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^6.6.6",
    "bcrypt": "^6.0.0",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5"
  }
}
```

Frontend:
```json
{
  "dependencies": {
    "@mui/material": "^5.14.11",
    "@reduxjs/toolkit": "^1.9.7",
    "react-query": "^3.39.3",
    "react-toastify": "^11.0.5"
  }
}
```

## 🧪 Testing

```powershell
# Backend tests
cd ".\nodeapp"
npm test

# Frontend tests
cd ".\reactapp"
npm test
```

## 📚 API Reference

<details>
<summary>🔐 User Management</summary>

```javascript
// Authentication
POST   /api/users/login      // User login with JWT return
POST   /api/users/register   // New user registration
GET    /api/users/profile    // Get logged in user's profile
PUT    /api/users/profile    // Update user profile

// For Managers
GET    /api/users/employees  // List all employees (manager only)
```
</details>

<details>
<summary>📝 Leave Management</summary>

```javascript
// Employee endpoints
POST   /api/leave           // Submit new leave request
GET    /api/leave          // List my leave requests
GET    /api/leave/:id      // Get specific leave request
PUT    /api/leave/:id      // Update leave request

// Manager endpoints
GET    /api/leave/pending  // List pending leave requests
PUT    /api/leave/:id/status  // Approve/reject leave
```
</details>

<details>
<summary>🏠 WFH (Work From Home)</summary>

```javascript
// Employee endpoints
POST   /api/wfh            // Submit new WFH request
GET    /api/wfh           // List my WFH requests
GET    /api/wfh/:id       // Get specific WFH request
PUT    /api/wfh/:id       // Update WFH request

// Manager endpoints
GET    /api/wfh/pending   // List pending WFH requests
PUT    /api/wfh/:id/status   // Approve/reject WFH
```
</details>

> 🔒 All endpoints except login/register require a valid JWT token in the Authorization header

## 🤝 Contributing

We love contributions! Here's how you can help:

1. 🍴 Fork the repository
2. 🌱 Create your feature branch
3. 💻 Make your changes
4. 🔍 Test your changes
5. 📤 Push to your branch
6. 🎯 Open a Pull Request

## 📃 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Acknowledgments

- Thanks to all our contributors
- Built with React and Node.js
- MongoDB for database
- Express.js for API

---

<div align="center">

Made with ❤️ by 3lade

[Report Bug](../../issues) • [Request Feature](../../issues)

</div>
