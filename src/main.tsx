import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Preloader from './pages/Preloader';
import CustomCursor from './components/CustomCursor';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Preloader />
      <App />
      <CustomCursor />
  </React.StrictMode>
);