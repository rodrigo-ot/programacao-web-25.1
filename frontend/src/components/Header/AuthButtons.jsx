import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from "react";
import { useAuth } from '../../contexts/AuthContext'; // Importa o hook de autenticação
import CreateRecipeModal from "./CreateRecipeModal";

function AuthButtons() {
  const [showModal, setShowModal] = useState(false);
  const { user, logout } = useAuth(); // Obtém o usuário logado e a função de logout do contexto

  const handleLogout = () => {
    logout(); 
  };

  return (
    <div className="buttons-container flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0 sm:ml-4">
      {user ? (
        // Se o usuário estiver logado, exibe "Encerrar sessão"
        <button
          onClick={handleLogout}
          className="btn bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg text-sm w-full sm:w-auto"
        >
          Encerrar sessão
        </button>
      ) : (
        // Se o usuário não estiver logado, exibe "Acessar conta" e "Criar conta"
        <>
          <Link
            to="/login"
            className="btn bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg text-sm w-full sm:w-auto text-center"
          >
            Acessar conta
          </Link>
          <Link
            to="/register"
            className="btn bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-sm w-full sm:w-auto text-center"
          >
            Criar conta
          </Link>
        </>
      )}

      {user && user.role === "creator" && (
        <button
          id="post-button"
          onClick={() => setShowModal(true)}
          className="btn bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-sm w-full sm:w-auto"
        >
          Postar Receita
        </button>
      )}
      
      <CreateRecipeModal isOpen={showModal} onClose={() => setShowModal(false)} />  
    </div>
  );
}

export default AuthButtons;
