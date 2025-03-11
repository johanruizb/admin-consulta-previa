import { getIronSession } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Handler para la ruta API de Next.js que recupera un archivo multimedia.
 *
 * @param {NextApiRequest} req - El objeto de solicitud HTTP.
 * @param {NextApiResponse} res - El objeto de respuesta HTTP.
 *
 * @returns {Promise<void>} - Una promesa que se resuelve cuando la operación de inicio de sesión se completa.
 **/
export default async function handler(req, res) {
    const session = await getIronSession(req, res, {
        password: process.env.SESSION_SECRET,
        cookieName: "session",
    });

    try {
        const response = await fetch(
            process.env.NEXT_PUBLIC_BASE_URL +
                "/api/v1/moodle/reporte/exportar",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + session.accessToken,
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
            // const content = await response.json();
            const contentType = response.headers.get("content-type");
            const content = Buffer.from(await response.arrayBuffer());

            res.setHeader("Content-Type", contentType);
            res.status(response.status).send(content);
        }
    } catch (e) {
        res.status(500).json({ status: 500, statusText: e.message });
    }
}
