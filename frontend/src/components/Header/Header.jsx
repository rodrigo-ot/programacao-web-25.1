import React from 'react';
import LogoAndSitename from './Logo'; // Importa o novo componente
import Navbar from './Navbar'; // Importa o novo componente
import AuthButtons from './AuthButtons'; // Importa o novo componente

function Header() {
  return (
    <header className="bg-gray-100 border-b border-gray-300 shadow-sm py-3">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">

        {/* Componente para Logo e Título */}
        <LogoAndSitename />

        {/* Componente para Navegação */}
        <Navbar />

        {/* Componente para Botões de Autenticação */}
        <AuthButtons />

      </div>
    </header>
  );
}

export default Header;
