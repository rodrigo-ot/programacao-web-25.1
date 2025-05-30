const API_URL = "http://localhost:8001"; // ajuste conforme seu backend

export async function login(username, password) {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const res = await fetch(`${API_URL}/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Erro ao logar");
    }

    return res.json(); // { access_token, token_type }
}

export async function register(data) {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Erro ao registrar");
    }

    return res.json(); // { message: "User registered successfully" }
}

export async function getUserInfo(token) {
    const res = await fetch(`${API_URL}/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Erro ao buscar informações do usuário");
    }

    return res.json();
}
