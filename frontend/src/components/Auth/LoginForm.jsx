import AuthForm from "./AuthForm";
import { useAuth } from '../../contexts/AuthContext';

export default function LoginForm() {

    const { login } = useAuth();

    const fields = [
        { name: "username", label: "Usuário" },
        { name: "password", label: "Senha", type: "password" }
    ];

    const handleLogin = async (formData) => {
        try {
            const userInfo = await login(formData.username, formData.password);
            console.log(`acesso: ${userInfo.username} (${userInfo.role})`);


        } catch (error) {

            console.error("erro teste", error);
            throw error; 
        }
    };

    return (
        <AuthForm
            onSubmit={handleLogin}
            fields={fields}
            title="Login"
            submitText="Entrar"
        />
    );
}
