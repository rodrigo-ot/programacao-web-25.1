

function RecipeImage({ imageUrl, title }) {
  return (
    <>
      {imageUrl ? (
        <img
          src={imageUrl}
          className="w-full h-60 object-cover"
          alt={title}
        />
      ) : (
        <div className="w-full h-60 bg-gray-200 flex items-center justify-center text-gray-500">
          <span className="text-lg">Sem Imagem</span>
        </div>
      )}
    </>
  );
}

export default RecipeImage;