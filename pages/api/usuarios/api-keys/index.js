import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
    const { getToken } = getAuth(req);
    const token = await getToken();

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/usuarios/api-keys`,
            {
                method: req.method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body:
                    req.method !== "GET" ? JSON.stringify(req.body) : undefined,
            },
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.status(200).json(data);
    } catch (error) {
        console.error("Error en proxy API Keys:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
