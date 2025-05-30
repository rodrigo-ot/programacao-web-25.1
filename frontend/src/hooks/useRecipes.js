import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:8001/receitas'; 

export const useRecipes = () => {
  const { user, loadingAuth } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(API_URL);
      setRecipes(data);
    } catch (err) {
      console.error("Erro ao buscar receitas:", err);
      setError("Não foi possível carregar as receitas. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }, []);

  const removeRecipe = useCallback(async (id, title) => {
    if (!user || user.role !== 'creator') {
      alert("Você não tem permissão para remover receitas.");
    }

    if (window.confirm(`Tem certeza que deseja remover a receita "${title}"?`)) {
      try {
        const token = localStorage.getItem('token'); // Obtém o token para a requisição
        if (!token) {
          alert("Sua sessão expirou. Por favor, faça login novamente.");
          return false;
        }

        await axios.delete(`${API_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== id));
        alert(`Receita "${title}" removida com sucesso!`);
        return true; 
      } catch (err) {
        console.error("Erro ao remover receita:", err);
        setError("Erro ao remover receita. Tente novamente.");
        alert("Erro ao remover receita. Tente novamente.");
        return false;
      }
    }
    return false; 
  }, [user]); 

  useEffect(() => {
    if (!loadingAuth) {
      fetchRecipes();
    }
  }, [loadingAuth, fetchRecipes]);

  return { recipes, loading, error, removeRecipe, fetchRecipes };
};
