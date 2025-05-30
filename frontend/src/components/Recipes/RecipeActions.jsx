function RecipeActions({ recipeId, recipeTitle, onEdit, onRemove }) {
  return (
    <div className="flex space-x-2">
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-sm"
        onClick={() => onRemove(recipeId, recipeTitle)}
      >
        Remover
      </button>
      <button
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg text-sm"
        onClick={() => onEdit(recipeId)}
      >
        ⚙️
      </button>
    </div>
  );
}

export default RecipeActions;