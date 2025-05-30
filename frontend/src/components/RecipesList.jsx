
import { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeCard from './RecipeCard'; 

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole] = useState('viewer');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:8001/receitas');
        setRecipes(response.data);
      } catch (err) {
        console.error("Erro ao buscar receitas:", err);
        setError("Não foi possível carregar as receitas. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);


  const handleRemoveRecipe = async (id, title) => {
    if (window.confirm(`Tem certeza que deseja remover a receita "${title}"?`)) {
      try {
        await axios.delete(`http://localhost:8001/receitas/${id}`); 
        setRecipes(recipes.filter(recipe => recipe.id !== id)); 
        alert(`Receita "${title}" removida com sucesso!`);
      } catch (err) {
        console.error("Erro ao remover receita:", err);
        alert("Erro ao remover receita. Tente novamente.");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-lg font-medium text-gray-700">Carregando receitas...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600 font-bold">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Receitas postadas</h2>
      {recipes.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">Nenhuma receita encontrada. Seja o primeiro a postar!</p>
      ) : (
        <div className="flex flex-wrap -mx-4"> {}
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id} 
              recipe={recipe}
              userRole={userRole}
              onRemove={handleRemoveRecipe}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeList;