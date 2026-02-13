import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
    const { getToken } = getAuth(req);
    const token = await getToken();

    const queryParams = new URLSearchParams(req.query).toString();
    const url =
        process.env.NEXT_PUBLIC_BASE_URL +
        "/api/usuarios/eliminados" +
        (queryParams ? `?${queryParams}` : "");

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.ok) {
        const data = await response.json();
        res.status(200).json(data);
    } else {
        res.status(response.status).json({ error: "Error al obtener personas eliminadas" });
    }
}

export const config = {
    api: {
        responseLimit: false,
    },
};
