import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
    const { getToken } = getAuth(req);
    const token = await getToken();

    const id = parseInt(req.query.id);
    if (!id) {
        return res.status(400).json({ message: "ID inválido" });
    }

    if (req.method === "GET") {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/usuarios/eliminados/${id}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        const result = await response.json();
        res.status(response.status).json(result);
    } else if (req.method === "POST") {
        // Restaurar persona
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/usuarios/eliminados/${id}/restaurar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            },
        );
        const result = await response.json();
        res.status(response.status).json(result);
    } else {
        res.status(405).json({ message: "Método no permitido" });
    }
}

export const config = {
    api: {
        responseLimit: false,
    },
};
