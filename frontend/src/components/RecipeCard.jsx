
import RecipeImage from './RecipeImage'; 
import RecipeActions from './RecipeActions'; 

function RecipeCard({ recipe, userRole, onView, onEdit, onRemove }) {
  const ingredientsList =
    recipe.ingredients && recipe.ingredients.length > 0
      ? recipe.ingredients.map(i => i.name).join(', ')
      : 'N/A';

  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-6">
      <div className="h-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-300">
        <RecipeImage imageUrl={recipe.image_url} title={recipe.title} />

        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{recipe.title}</h3>
          <p className="text-gray-700 text-sm mb-4">
            <strong>Ingredientes:</strong> {ingredientsList}
          </p>

          <div className="flex justify-between items-center mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-sm"
              onClick={() => onView(recipe.id)}
            >
              Ver preparo
            </button>

            {userRole === "viewer" && (
              <RecipeActions
                recipeId={recipe.id}
                recipeTitle={recipe.title}
                onEdit={onEdit}
                onRemove={onRemove}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;