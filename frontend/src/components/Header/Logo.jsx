import React from 'react';

function Logo() {
  return (
    <div className="flex items-center mb-4 sm:mb-0">
      {/* Usando o caminho da sua imagem para o logo */}
      <img src="/static/imgs/logo.png" alt="Receita Fácil" className="h-16 w-auto object-contain mr-3" />
      <h1 className="text-3xl font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>ReceitaFácil</h1>
    </div>
  );
}

export default Logo;
