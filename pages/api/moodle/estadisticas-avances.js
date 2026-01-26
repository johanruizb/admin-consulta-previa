import { getAuth } from "@clerk/nextjs/server";

/**
 * Handler para obtener estadísticas agregadas de avances de cursos.
 * GET /api/moodle/estadisticas-avances?ciclo_id=X&curso_id=Y&grupo_id=Z
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Método no permitido" });
    }

    const { getToken } = getAuth(req);
    const token = await getToken();

    const { ciclo_id, curso_id, grupo_id } = req.query;

    const params = new URLSearchParams();
    if (ciclo_id) params.append("ciclo_id", ciclo_id);
    if (curso_id) params.append("curso_id", curso_id);
    if (grupo_id) params.append("grupo_id", grupo_id);

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/moodle/estadisticas-avances?${params.toString()}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        },
    );

    try {
        const result = await response.json();
        res.status(response.status).json(result);
    } catch (e) {
        res.status(response.status).json({
            statusText: response.statusText,
            error: e,
        });
    }
}
