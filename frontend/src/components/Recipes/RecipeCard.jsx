// src/components/RecipeCard.jsx
import RecipeImage from './RecipeImage';
import RecipeActions from './RecipeActions';
import { useNavigate } from "react-router-dom";

function RecipeCard({ recipe, userRole, onView, onEdit, onRemove }) {
  const ingredientsList = recipe.ingredients?.map(i => i.name).join(', ') || 'N/A';
  const navigate = useNavigate();

  // Exibir ações apenas para creators (ou clients, se quiser):
  const canEdit = userRole === "creator" /*|| userRole === "client"*/;

  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300">
        <RecipeImage imageUrl={recipe.image_url} title={recipe.title} />

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
          <p className="text-gray-700 text-sm mb-4">
            <strong>Ingredientes:</strong> {ingredientsList}
          </p>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => navigate(`/receitas/${recipe.id}`)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm"
            >
              Ver preparo
            </button>

            {canEdit && (
              <RecipeActions
                recipeId={recipe.id}
                recipeTitle={recipe.title}
                onEdit={() => onEdit(recipe.id)}
                onRemove={() => onRemove(recipe.id, recipe.title)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
