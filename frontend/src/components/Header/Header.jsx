import React from 'react';
import LogoAndSitename from './Logo'; // Importa o novo componente
import Navbar from './Navbar'; // Importa o novo componente
import AuthButtons from './AuthButtons'; // Importa o novo componente
import SearchBar from '../SearchBar';

function Header() {
  return (
<header className="bg-gray-100 border-b border-gray-300 shadow-sm py-3">
  <div className="container mx-auto px-4 flex items-center relative">
    
    {/* Logo - ocupa 1/3 */}
    <div className="flex-1 flex items-center">
      <LogoAndSitename />
    </div>

    {/* Navbar - ocupa 1/3 e centralizado */}
    <nav className="flex-1 flex justify-center">
      <Navbar />
    </nav>

    {/* SearchBar + AuthButtons - ocupa 1/3 e alinhado à direita */}
    <div className="flex-1 flex justify-end items-center gap-4">
      <SearchBar />
      <AuthButtons />
    </div>
  </div>
</header>



  );
}

export default Header;
