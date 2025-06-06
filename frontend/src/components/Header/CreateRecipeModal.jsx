import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function CreateRecipeModal({ isOpen, onClose }) {
  const { createRecipe } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrorMsg("");

    try {
      await createRecipe({
        title,
        description,
        image_url: imageUrl,
        ingredients: ingredients
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i !== ""),
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || "Erro ao postar receita.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 sm:p-12">
        <button
          onClick={onClose}
          aria-label="Fechar modal"
          className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition-colors text-2xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">
          Nova Receita
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-5 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
          />

          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
            className="w-full resize-none rounded-lg border border-gray-300 px-5 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
          />

          <input
            type="url"
            placeholder="URL da imagem"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-5 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
          />

          <input
            type="text"
            placeholder="Ingredientes (separados por vírgula)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-5 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando..." : "Criar Receita"}
          </button>

          {success && (
            <p className="text-center text-green-600 font-semibold mt-4 animate-fadeIn">
              Receita criada com sucesso! 🎉
            </p>
          )}

          {errorMsg && (
            <p className="text-center text-red-600 font-semibold mt-4 animate-fadeIn">
              {errorMsg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
