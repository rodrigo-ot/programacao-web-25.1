import AuthForm from "./AuthForm";
import { register } from '../../services/authService';

export default function RegisterForm() {
    const fields = [
        { name: "username", label: "Usuário" },
        { name: "email", label: "Email", type: "email" },
        { name: "password", label: "Senha", type: "password" },
        { name: "role", label: "Função (ex: user/admin)" }
    ];

    const handleRegister = async (formData) => {
        await register(formData);
        alert("Cadastro realizado com sucesso!");
    };

    return (
        <AuthForm
            onSubmit={handleRegister}
            fields={fields}
            title="Cadastro"
            submitText="Registrar"
        />
    );
}
