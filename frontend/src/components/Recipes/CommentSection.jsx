import { useEffect, useState } from "react";
import axios from "axios";

export default function CommentSection({ recipeId }) {
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [estrela, setEstrela] = useState(0);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8001/receitas/${recipeId}/comentarios`)
      .then((res) => setComentarios(res.data))
      .catch((err) => console.error("Erro ao carregar comentários:", err));
  }, [recipeId]);

  const enviarComentario = () => {
    if (!novoComentario.trim() || estrela === 0) return;

    setEnviando(true);
    axios
      .post(
        `http://localhost:8001/receitas/${recipeId}/comentarios`,
        {
          text: novoComentario,
          star: estrela,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setComentarios((prev) => [...prev, res.data]);
        setNovoComentario("");
        setEstrela(0);
      })
      .catch((err) => console.error("Erro ao enviar comentário:", err))
      .finally(() => setEnviando(false));
  };

  const renderEstrelas = (valorAtual, clicavel = false, onClick = () => {}) => {
    return (
      <div className="flex gap-1 text-yellow-400 text-2xl">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`cursor-${clicavel ? "pointer" : "default"} ${
              clicavel && i <= valorAtual ? "text-yellow-500" : ""
            }`}
            onClick={() => clicavel && onClick(i)}
          >
            {i <= valorAtual ? "★" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="border-t border-gray-200 mt-10 pt-10 px-10">
      <h2 className="text-3xl font-semibold text-gray-900 mb-6">Comentários</h2>

      {comentarios.length === 0 ? (
        <div className="text-gray-500 text-lg italic mb-10">
          Nenhum comentário ainda. Seja o primeiro a comentar!
        </div>
      ) : (
        <ul className="space-y-6 mb-10">
          {comentarios.map((c) => (
            <li key={c.id} className="text-gray-800 bg-gray-100 p-4 rounded-xl">
              <div className="font-semibold text-emerald-600">{c.username}</div>
              <div className="mb-2">{renderEstrelas(c.star)}</div>
              <p className="text-lg">{c.text}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Formulário de novo comentário */}
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          enviarComentario();
        }}
      >
        <label className="block text-lg font-medium text-gray-700">
          Sua avaliação:
        </label>
        {renderEstrelas(estrela, true, setEstrela)}

        <textarea
          placeholder="Escreva seu comentário..."
          className="w-full border border-gray-300 rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-lg"
          rows={5}
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
        ></textarea>

        <button
          type="submit"
          disabled={enviando || estrela === 0 || !novoComentario.trim()}
          className="bg-emerald-500 text-white px-8 py-3 rounded-2xl hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
        >
          {enviando ? "Enviando..." : "Enviar Comentário"}
        </button>
      </form>
    </div>
  );
}
