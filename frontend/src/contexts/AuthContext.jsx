import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../services/authService'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token'); 
      if (token) {
        try {
          const userInfo = await authService.getUserInfo(token);
          setUser(userInfo); 
        } catch (error) {
          console.error("Erro ao carregar informações do usuário:", error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoadingAuth(false);
    };
    loadUser();
  }, []);

  const login = async (username, password) => {
    try {
      const data = await authService.login(username, password);
      localStorage.setItem('token', data.access_token); 
      const userInfo = await authService.getUserInfo(data.access_token);
      setUser(userInfo);
      return userInfo;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); 
    setUser(null);
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      console.error("Erro no registro:", error);
      throw error;
    }
  };

  const createRecipe = async (recipeData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Usuário não autenticado");
      const response = await authService.createRecipe(recipeData, token);
      return response;
    } catch (error) {
      console.error("Erro ao criar receita:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loadingAuth, login, logout, register, createRecipe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
