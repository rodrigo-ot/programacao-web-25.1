// src/components/Auth/AuthContainer.jsx
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

/**
 * Componente container que gerencia a exibição dos formulários de Login e Registro.
 * Também gerencia e exibe alertas globais.
 * @param {Object} props - As propriedades do componente.
 * @param {function} props.onAuthSuccess - Callback acionado após login/registro bem-sucedido.
 */
function AuthContainer({ onAuthSuccess }) {
  const [currentForm, setCurrentForm] = useState('login'); // 'login' ou 'register'
  const [alertMessage, setAlertMessage] = useState('');
  const [isAlertError, setIsAlertError] = useState(false);

  // Função para exibir alertas globais
  const showAlert = (message, isError) => {
    setAlertMessage(message);
    setIsAlertError(isError);
    // Esconde o alerta após 5 segundos
    setTimeout(() => {
      setAlertMessage('');
    }, 5000);
  };

  const handleLoginSuccess = (token) => {
    showAlert('Login bem-sucedido!', false);
    if (onAuthSuccess) onAuthSuccess(token);
  };

  const handleRegisterSuccess = () => {
    showAlert('Registro bem-sucedido! Agora você pode fazer login.', false);
    setCurrentForm('login'); // Volta para o formulário de login
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Seja Bem-vindo(a)!</h1>
      </header>

      {/* Área para exibir alertas */}
      {alertMessage && (
        <div className={`p-4 mb-4 rounded-lg text-white ${isAlertError ? 'bg-red-500' : 'bg-green-500'}`}>
          {alertMessage}
        </div>
      )}

      {/* Renderização condicional dos formulários */}
      {currentForm === 'login' ? (
        <LoginForm 
          onLoginSuccess={handleLoginSuccess} 
          onShowAlert={showAlert} 
        />
      ) : (
        <RegisterForm 
          onRegisterSuccess={handleRegisterSuccess} 
          onShowAlert={showAlert} 
        />
      )}

      {/* Botões para alternar entre login e registro */}
      <button
        onClick={() => setCurrentForm(currentForm === 'login' ? 'register' : 'login')}
        className="mt-6 text-blue-600 hover:text-blue-800 font-medium"
      >
        {currentForm === 'login' ? 
          'Não tem uma conta? Registre-se!' : 
          'Já tem uma conta? Faça login.'
        }
      </button>
    </div>
  );
}

export default AuthContainer;