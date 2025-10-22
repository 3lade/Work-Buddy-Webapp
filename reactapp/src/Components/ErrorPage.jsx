import React from 'react';
import './ErrorPage.css';

function ErrorPage() {
  return (
    <div className="error-page-container">
      <div className="error-content">
        <img 
          src="/alert.png" 
          alt="Error" 
          className="error-image"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We're sorry, but something unexpected happened.</p>
        <p>Please try again later.</p>
      </div>
    </div>
  );
}

export default ErrorPage;