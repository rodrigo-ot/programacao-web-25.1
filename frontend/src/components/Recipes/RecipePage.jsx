import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:8001/receitas/${id}`)
      .then((res) => setRecipe(res.data))
      .catch((err) => console.error("Erro ao buscar receita:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg text-gray-500 animate-pulse">Carregando...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg text-red-500">Receita não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Botão de Voltar */}
        <div className="px-8 pt-6 pb-4 flex items-center gap-3 cursor-pointer hover:text-emerald-600 transition text-gray-700 select-none" onClick={() => navigate(-1)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-semibold text-lg">Voltar</span>
        </div>

        <div className="grid md:grid-cols-2">
          {/* Imagem */}
          <div className="h-64 md:h-auto overflow-hidden rounded-bl-3xl md:rounded-bl-none md:rounded-tl-3xl">
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          {/* Conteúdo */}
          <div className="p-10 flex flex-col justify-between">
            <div>
              <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
                {recipe.title}
              </h1>

              <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                {recipe.description}
              </p>

              <h2 className="text-3xl font-semibold text-gray-800 mb-5">
                Ingredientes
              </h2>

              <ul className="space-y-3 text-gray-800 text-lg">
                {recipe.ingredients.map((ingredient) => (
                  <li
                    key={ingredient.id}
                    className="flex items-center gap-3"
                  >
                    <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                    {ingredient.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Seção de Comentários */}
        <div className="border-t border-gray-200 mt-10 pt-10 px-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            Comentários
          </h2>

          {/* Placeholder de comentários */}
          <div className="space-y-6 mb-10 text-gray-500 text-lg italic">
            <p>
              Nenhum comentário ainda. Seja o primeiro a comentar!
            </p>
            {/* Aqui futuramente você pode mapear os comentários */}
          </div>

          {/* Formulário de novo comentário */}
          <form className="space-y-5">
            <textarea
              placeholder="Escreva seu comentário..."
              className="w-full border border-gray-300 rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-lg"
              rows={5}
              disabled
            ></textarea>

            <button
              type="button"
              disabled
              className="bg-emerald-500 text-white px-8 py-3 rounded-2xl hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
            >
              Enviar Comentário
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
