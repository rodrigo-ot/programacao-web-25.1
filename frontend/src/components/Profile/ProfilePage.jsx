import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProfilePage() {
  const { id } = useParams(); // Pega o ID da URL (:id)
  const navigate = useNavigate();
  const [authorProfile, setAuthorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:8001/autores/${id}`)
      .then((res) => setAuthorProfile(res.data))
      .catch((err) => console.error("Erro ao buscar perfil do autor:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-center p-10">Carregando perfil...</div>;
  }

  if (!authorProfile) {
    return <div className="text-center p-10 text-red-500">Perfil não encontrado.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Botão de Voltar */}
        <button 
            onClick={() => navigate(-1)} 
            className="mb-6 text-emerald-600 hover:text-emerald-800 font-semibold"
        >
            &larr; Voltar
        </button>

        <div className="bg-white p-8 rounded-2xl shadow-md border">
            <h1 className="text-4xl font-bold text-gray-800">
                {authorProfile.username}
            </h1>
            <p className="text-gray-500 mt-1">
                Todas as receitas postadas por {authorProfile.username}.
            </p>
        </div>

        <div className="mt-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Receitas Publicadas</h2>
          {authorProfile.recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {authorProfile.recipes.map((recipe) => (
                <Link to={`/receitas/${recipe.id}`} key={recipe.id} className="group">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
                    <img 
                      src={recipe.image_url || 'https://placehold.co/600x400'} 
                      alt={recipe.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {recipe.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 bg-white p-6 rounded-2xl border">
              Este autor ainda não postou nenhuma receita.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}