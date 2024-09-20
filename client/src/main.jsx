import React from 'react';
import { createRoot } from 'react-dom/client'; // Correct import for createRoot
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container); // Use createRoot from react-dom/client
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
);
