# 🏢 Work Buddy WebApp

<div align="center">

[![Node.js Version](https://img.shields.io/badge/node-v18.x-brightgreen.svg)](https://nodejs.org)
[![React Version](https://img.shields.io/badge/react-v18.2.0-blue.svg)](https://reactjs.org)
[![License](https://img.shields.io/badge/license-MIT-purple.svg)](LICENSE)
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

## 🎨 Screenshots

<div align="center">
<table>
<tr>
<td width="33%">

### 📱 Employee Dashboard
![Employee Dashboard](https://via.placeholder.com/300x200?text=Employee+Dashboard)
</td>
<td width="33%">

### 📋 Leave Request Form
![Leave Form](https://via.placeholder.com/300x200?text=Leave+Form)
</td>
<td width="33%">

### 📊 Manager View
![Manager Dashboard](https://via.placeholder.com/300x200?text=Manager+Dashboard)
</td>
</tr>
</table>
</div>

## ✨ Features

<table>
<tr>
<td width="50%">

### 💼 For Employees
- **Smart Request Forms** - Intuitive leave/WFH submission
- **Request Tracking** - Real-time status updates
- **History View** - Complete request archive
- **Profile Management** - Easy profile updates

</td>
<td width="50%">

### 👑 For Managers
- **Team Dashboard** - Overview of all requests
- **Quick Actions** - One-click approve/reject
- **Team Calendar** - Visual leave schedule
- **Analytics** - Team attendance insights

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

### Backend (.env)

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/workbuddy
JWT_SECRET=your-secret-key
```

### Frontend (src/apiConfig.js)

```javascript
export const API_BASE_URL = 'http://localhost:3000/api';
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
<summary>🔐 Authentication Endpoints</summary>

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - New user registration
</details>

<details>
<summary>📝 Leave Request Endpoints</summary>

- `POST /api/leave` - Submit leave request
- `GET /api/leave` - Get user's leaves
- `PUT /api/leave/:id` - Update request
</details>

<details>
<summary>🏠 WFH Request Endpoints</summary>

- `POST /api/wfh` - Submit WFH request
- `GET /api/wfh` - Get user's WFH requests
- `PUT /api/wfh/:id` - Update WFH status
</details>

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

Made with ❤️ by the Work Buddy Team

[Report Bug](../../issues) • [Request Feature](../../issues)

</div>
