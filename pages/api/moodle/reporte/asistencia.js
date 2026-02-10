import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
    const { getToken } = getAuth(req);
    const token = await getToken();

    try {
        const response = await fetch(
            process.env.NEXT_PUBLIC_BASE_URL +
                "/api/v1/moodle/reporte/asistencia",
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
