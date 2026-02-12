import { getAuth } from "@clerk/nextjs/server";

/**
 * Proxy para exportar avance por grupo a Excel.
 * POST /api/moodle/avance-por-grupo-exportar
 */
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Método no permitido" });
    }

    const { getToken } = getAuth(req);
    const token = await getToken();

    try {
        const response = await fetch(
            process.env.NEXT_PUBLIC_BASE_URL +
                "/api/v1/moodle/avance-por-grupo",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(req.body),
            },
        );

        if (!response.ok)
            res.status(response.status).send({
                status: response.status,
                statusText: response.statusText,
            });
        else {
            const contentType = response.headers.get("content-type");
            const content = Buffer.from(await response.arrayBuffer());

            res.setHeader("Content-Type", contentType);
            res.status(response.status).send(content);
        }
    } catch (e) {
        res.status(500).json({ status: 500, statusText: e.message });
    }
}
