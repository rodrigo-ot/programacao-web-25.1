import { useState, useRef, useEffect } from "react";
import axios from "axios";

function SearchBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const wrapperRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      setResults([]);
      setDropdownOpen(false);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get("http://localhost:8001/receitas/buscar", {
        params: { query: search }, // <-- backend precisa aceitar tanto título quanto ingrediente
      });
      setResults(response.data);
      setDropdownOpen(true);
    } catch (error) {
      console.error("Erro na busca:", error);
      setResults([]);
      setDropdownOpen(false);
    } finally {
      setLoading(false);
    }
  };

  // Fecha dropdown se clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="relative bg-gray-100 px-6 py-4" ref={wrapperRef}>
      <form
        onSubmit={handleSearch}
        className="flex gap-4 max-w-xl mx-auto"
      >
        <input
          type="text"
          placeholder="Buscar por ingrediente ou título..."
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

      {dropdownOpen && results.length > 0 && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-full max-w-xl bg-white rounded-md shadow-lg z-50">
          <ul className="divide-y divide-gray-200">
            {results.map((receita) => (
              <li key={receita.id}>
                <a
                  href={`/receitas/${receita.id}`}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition"
                >
                  <img
                    src={receita.image_url}
                    alt={receita.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{receita.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {receita.description}
                    </p>
                    <div className="flex items-center mt-1">
                      {/* Placeholder para avaliação */}
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-4 h-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.073 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.073 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.073-3.292a1 1 0 00-.364-1.118L2.428 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.073-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {dropdownOpen && results.length === 0 && !loading && search.trim() && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-full max-w-xl bg-white rounded-md shadow z-50 text-center text-gray-500 py-4">
          Nenhuma receita encontrada.
        </div>
      )}
    </div>
  );
}

export default SearchBar;
