import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
    const { api_key_id } = req.query;
    const { getToken } = getAuth(req);
    const token = await getToken();

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/usuarios/api-keys/${api_key_id}/toggle`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.status(response.status).json(data);
    } catch (error) {
        console.error("Error en proxy toggle API Key:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
