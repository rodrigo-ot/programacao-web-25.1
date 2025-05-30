import RecipeCard from './RecipeCard';
import { useAuth } from '../../contexts/AuthContext';
import { useRecipes } from '../../hooks/useRecipes'; // Importe o novo hook

function RecipeList() {
  const { user, loadingAuth } = useAuth();
  const userRole = user?.role;

  const { recipes, loading, error, removeRecipe } = useRecipes();

  const handleEditRecipe = (id) => {
  };

  if (loading || loadingAuth) {
    return <div className="text-center py-8 text-lg font-medium text-gray-700">Carregando...</div>;
  }
  if (error) {
    return <div className="text-red-600 text-center py-8 font-bold">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Receitas</h2>

      {recipes.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">Nenhuma receita cadastrada.</p>
      ) : (
        <div className="flex flex-wrap -mx-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              userRole={userRole} 
              onView={() => {}} 
              onEdit={handleEditRecipe}
              onRemove={removeRecipe} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeList;
