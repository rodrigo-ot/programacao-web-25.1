import AuthForm from "./AuthForm";
import { register } from '../../services/authService'; // Assuming this service interacts with your FastAPI backend
import React, { useState } from 'react';

export default function RegisterForm() {
    // State to manage messages displayed to the user (success or error)
    const [message, setMessage] = useState({ text: '', type: '' });

    // Define the form fields, including the new 'confirmPassword' and 'role' as a select
    const fields = [
        { name: "username", label: "Usuário" },
        { name: "email", label: "Email", type: "email" },
        { name: "password", label: "Senha", type: "password" },
        { name: "confirmPassword", label: "Confirmar Senha", type: "password" }, // New field for confirmation
        {
            name: "role",
            label: "Função",
            type: "select",
            options: [
                { value: "client", label: "Cliente" },
                { value: "creator", label: "Criador" }
            ]
        }
    ];

    const handleRegister = async (formData) => {
        setMessage({ text: '', type: '' });

        if (formData.password !== formData.confirmPassword) {
            setMessage({ text: "As senhas não coincidem!", type: "error" });
            return;
        }
        const { confirmPassword, ...dataToRegister } = formData;

        try {
            await register(dataToRegister);

            setMessage({ text: "Cadastro realizado com sucesso!", type: "success" });

            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 5000);

        } catch (error) {
            console.error("Erro no cadastro:", error);
            setMessage({ text: error.message || "Ocorreu um erro no cadastro. Tente novamente.", type: "error" });

            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 7000);
        }
    };

    return (
        <div>
            <AuthForm
                onSubmit={handleRegister}
                fields={fields}
                title="Cadastro"
                submitText="Registrar"
            />

            {message.text && (
                <div
                    className={`mt-4 p-4 rounded-lg text-sm shadow-md mx-auto max-w-md ${
                        message.type === 'success'
                            ? 'bg-green-50 text-green-700 border border-green-300' 
                            : 'bg-red-50 text-red-700 border border-red-300'       
                    }`}
                >
                    {message.text}
                </div>
            )}
        </div>
    );
}