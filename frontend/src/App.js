// src/App.js (ou src/App.jsx)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importe seus componentes
import Header from './components/Header';
import RecipesList from './components/RecipesList';
// import OtherPage from './pages/OtherPage'; // Exemplo: se tiver outras páginas

function App() {
  return (
    <Router>
      {/* O Header fica fora das Routes se ele for aparecer em todas as páginas */}
      <Header />

      {/* Ocupa o restante do espaço vertical, se usar flexbox no body/html */}
      <main className="flex-grow">
        {/* As Rotas definem qual componente será renderizado para cada URL */}
        <Routes>
          {/* A rota raiz '/' renderiza o RecipeList */}
          <Route path="/" element={<RecipesList />} />
          {/* Exemplo de outras rotas */}
          {/* <Route path="/outra-pagina" element={<OtherPage />} /> */}
        </Routes>
      </main>

      {/* Se você tiver um componente de rodapé, ele também ficaria aqui, fora das Routes */}
      {/* <Footer /> */}
    </Router>
  );
}

export default App;