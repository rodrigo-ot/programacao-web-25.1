import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav className="flex-grow flex justify-end sm:justify-center">
      {/* Botão de Toggle para Mobile */}
      <button
        className="sm:hidden text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 p-2 rounded-md"
        onClick={toggleNav}
        aria-label="Toggle navigation"
      >
        {/* Ícone de Hambúrguer (SVG) */}
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {/* Links de Navegação - Colapsáveis em Telas Pequenas */}
      <div
        className={`w-full sm:w-auto sm:flex ${isNavOpen ? 'block' : 'hidden'} sm:block mt-4 sm:mt-0`}
        id="navbarNav" // ID para potencial JS externo/acessibilidade
      >
        <ul className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <li>
            <Link
              to="/"
              className="block py-2 px-3 text-gray-700 font-medium hover:text-indigo-600 rounded-md transition duration-200"
              onClick={() => setIsNavOpen(false)} // Fecha o menu ao clicar no link
            >
              Início
            </Link>
          </li>
          <li>
            <Link
              to="/about" // Assumindo uma rota para "Sobre"
              className="block py-2 px-3 text-gray-700 font-medium hover:text-indigo-600 rounded-md transition duration-200"
              onClick={() => setIsNavOpen(false)}
            >
              Sobre
            </Link>
          </li>
          <li>
            <Link
              to="/contact" // Assumindo uma rota para "Contato"
              className="block py-2 px-3 text-gray-700 font-medium hover:text-indigo-600 rounded-md transition duration-200"
              onClick={() => setIsNavOpen(false)}
            >
              Contato
            </Link>
          </li>
          {/* Links de Login e Registro podem ser mostrados aqui no menu mobile se não estiverem nos botões */}
          <li className="sm:hidden"> {/* Mostra Login/Registrar no nav mobile se não estiverem no container de botões */}
            <Link
              to="/login"
              className="block py-2 px-3 text-gray-700 font-medium hover:text-indigo-600 rounded-md transition duration-200"
              onClick={() => setIsNavOpen(false)}
            >
              Login
            </Link>
          </li>
          <li className="sm:hidden">
            <Link
              to="/register"
              className="block py-2 px-3 text-gray-700 font-medium hover:text-indigo-600 rounded-md transition duration-200"
              onClick={() => setIsNavOpen(false)}
            >
              Registrar
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
