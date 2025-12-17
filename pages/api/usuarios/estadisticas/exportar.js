import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
    const { getToken } = getAuth(req);
    const token = await getToken();

    const queryParams = new URLSearchParams(req.query).toString();
    const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL +
            "/api/usuarios/estadisticas/exportar?" +
            queryParams,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (response.ok) {
        const contentDisposition = response.headers.get("Content-Disposition");
        const contentType = response.headers.get("Content-Type");

        res.setHeader(
            "Content-Type",
            contentType || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        );

        if (contentDisposition) {
            res.setHeader("Content-Disposition", contentDisposition);
        }

        const buffer = await response.arrayBuffer();
        res.status(200).send(Buffer.from(buffer));
    } else {
        res.status(response.status).json({ error: "No se pudo exportar el archivo" });
    }
}
