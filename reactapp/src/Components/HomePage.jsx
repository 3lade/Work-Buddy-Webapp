import React from 'react';
import './HomePage.css';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Paper
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

function HomePage() {
  return (
    <Box className="homepage-container">
      <Container maxWidth="lg" className="homepage-content">
        <Box className="homepage-image-wrapper">
          <img 
            src="/workbuddycoverimage.png" 
            alt="WorkBuddy" 
            className="homepage-image"
          />
        </Box>

        <Typography variant="h3" component="h1" className="homepage-title">
          Welcome to WorkBuddy
        </Typography>
        
        <Typography variant="body1" className="homepage-description">
          WorkBuddy is your comprehensive solution for managing workplace requests 
          and employee interactions. Our platform streamlines leave applications, 
          work-from-home requests, and team management, making workplace administration 
          efficient and transparent.
        </Typography>
        
        <Box className="features-section">
          <Typography variant="h4" component="h2" className="features-title">
            Key Features
          </Typography>
          
          <Grid container spacing={3} className="features-grid">
            <Grid item xs={12} sm={6} md={3}>
              <Card className="feature-card" elevation={3}>
                <CardContent className="feature-card-content">
                  <Box className="feature-icon-wrapper">
                    <WorkIcon className="feature-icon" />
                  </Box>
                  <Typography variant="h6" component="h3" className="feature-card-title">
                    Leave Management
                  </Typography>
                  <Typography variant="body2" className="feature-card-text">
                    Submit and track leave requests with ease. Get instant updates on approval status.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card className="feature-card" elevation={3}>
                <CardContent className="feature-card-content">
                  <Box className="feature-icon-wrapper">
                    <HomeWorkIcon className="feature-icon" />
                  </Box>
                  <Typography variant="h6" component="h3" className="feature-card-title">
                    Work From Home
                  </Typography>
                  <Typography variant="body2" className="feature-card-text">
                    Request flexible work arrangements and manage remote work schedules efficiently.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card className="feature-card" elevation={3}>
                <CardContent className="feature-card-content">
                  <Box className="feature-icon-wrapper">
                    <GroupIcon className="feature-icon" />
                  </Box>
                  <Typography variant="h6" component="h3" className="feature-card-title">
                    Team Overview
                  </Typography>
                  <Typography variant="body2" className="feature-card-text">
                    Managers can view all employees and monitor team availability at a glance.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card className="feature-card" elevation={3}>
                <CardContent className="feature-card-content">
                  <Box className="feature-icon-wrapper">
                    <CheckCircleIcon className="feature-icon" />
                  </Box>
                  <Typography variant="h6" component="h3" className="feature-card-title">
                    Quick Approvals
                  </Typography>
                  <Typography variant="body2" className="feature-card-text">
                    Streamlined approval process for managers to review and respond to requests promptly.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Paper elevation={2} className="info-section">
          <Typography variant="h5" component="h2" className="info-title">
            About WorkBuddy
          </Typography>
          <Typography variant="body1" className="info-text">
            WorkBuddy empowers organizations to manage their workforce effectively by 
            providing a centralized platform for all employee requests and manager approvals. 
            With intuitive interfaces and real-time updates, both employees and managers can 
            focus on what matters most - productivity and collaboration.
          </Typography>
        </Paper>

        <Paper elevation={2} className="contactUs-section">
          <Typography variant="h5" component="h3" className="contactUs-section-title">
            Contact Us
          </Typography>
          <Box className="contact-details">
            <Box className="contact-item">
              <EmailIcon className="contact-icon" />
              <Typography variant="body1" className="contactUs-section-email">
                email@example.com
              </Typography>
            </Box>
            <Box className="contact-item">
              <PhoneIcon className="contact-icon" />
              <Typography variant="body1" className="contactUs-section-phone">
                123-456-7890
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default HomePage;