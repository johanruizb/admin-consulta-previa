import { getAuth } from "@clerk/nextjs/server";

/**
 * Handler para la ruta API de Next.js que obtiene el historial de cambios de un usuario.
 *
 * @param {import("next").NextApiRequest} req - El objeto de solicitud HTTP.
 * @param {import("next").NextApiResponse} res - El objeto de respuesta HTTP.
 *
 * @returns {Promise<void>} - Una promesa que se resuelve cuando la operación se completa.
 **/
export default async function handler(req, res) {
    const { getToken } = getAuth(req);
    const token = await getToken();

    const id = parseInt(req.query.id);
    if (!id) {
        res.status(400).json({ error: "ID requerido" });
        return;
    }

    if (req.method === "GET") {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/usuarios/historial/${id}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        const result = await response.json();
        res.status(response.status).json(result);
    } else {
        res.status(405).json({ error: "Método no permitido" });
    }
}
