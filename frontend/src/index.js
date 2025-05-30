// src/index.js (ou src/main.jsx para Vite)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importe APENAS o componente App


// Certifique-se que o CSS principal com Tailwind esteja importado aqui
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /> {/* Renderize APENAS o componente App */}
  </React.StrictMode>
);