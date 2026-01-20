import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
    const { getToken } = getAuth(req);
    const token = await getToken();

    const { ciclo_id } = req.query;

    const url = new URL(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/usuarios/cursos/disponibles"
    );

    if (ciclo_id) {
        url.searchParams.set("ciclo_id", ciclo_id);
    }

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json();
    res.status(response.status).json(result);
}

export const config = {
    api: {
        responseLimit: false,
    },
};
