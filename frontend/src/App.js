// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



import Header from './components/Header/Header';
import RecipesList from './components/Recipes/RecipesList';
import RecipePage from './components/Recipes/RecipePage';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import { AuthProvider } from './contexts/AuthContext';
import SearchBar from './components/SearchBar'; 
import ProfilePage from './components/Profile/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
          <Routes>
            {}
            <Route path="/" element={
                <>
                  {/* <SearchBar />  */}
                  <RecipesList />
                </>
              }
            />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/receitas/:id" element={<RecipePage />} /> 
            <Route path="/perfil/:id" element={<ProfilePage />} />
            <Route path="/perfil/u" element={<ProfilePage />} />
          </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;


