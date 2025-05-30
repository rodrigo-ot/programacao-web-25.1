import { useState } from "react";
import axios from "axios";

function SearchBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get("http://localhost:8000/receitas/buscar", {
        params: { ingrediente: search },
      });
      setResults(response.data);
    } catch (error) {
      console.error("Erro na busca:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 px-6 py-4">
      <form
        onSubmit={handleSearch}
        className="flex gap-4 max-w-xl mx-auto"
      >
        <input
          type="text"
          placeholder="Buscar por ingrediente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {results.length > 0 && (
        <div className="mt-4 max-w-xl mx-auto bg-white rounded-md shadow">
          <ul>
            {results.map((receita) => (
              <li
                key={receita.id}
                className="border-b last:border-b-0"
              >
                <a
                  href={`/receitas/${receita.id}`}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  {receita.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.length === 0 && !loading && search.trim() && (
        <div className="mt-4 max-w-xl mx-auto text-center text-gray-500">
          Nenhuma receita encontrada.
        </div>
      )}
    </div>
  );
}

export default SearchBar;
