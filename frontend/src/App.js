// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Header from './components/Header/Header';
import RecipesList from './components/Recipes/RecipesList';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import { AuthProvider } from './contexts/AuthContext';
import SearchBar from './components/SearchBar'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <SearchBar />
          <Routes>
            <Route path="/" element={<RecipesList />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
          </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
