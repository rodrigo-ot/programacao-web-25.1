import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CreateRecipeModal from './CreateRecipeModal';

function AuthButtons() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  const handleProfile = () => {
    navigate(`/perfil/u?username=${user.username}`);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center focus:outline-none"
      >
        {user ? (
          <span className="text-sm font-bold text-gray-700">
            {user.username[0].toUpperCase()}
          </span>
        ) : (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2"
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M5.121 17.804A4 4 0 016 16h12a4 4 0 01.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {user ? (
            <>
              <button
                onClick={handleProfile}
                
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Meu Perfil
              </button>

              {user.role === 'creator' && (
                <button
                  onClick={() => {
                    setShowModal(true);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Nova Receita
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Acessar conta
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      )}

      <CreateRecipeModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

export default AuthButtons;