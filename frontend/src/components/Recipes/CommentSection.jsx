// CommentsSection.jsx
export default function CommentSection() {
  return (
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
  );
}
