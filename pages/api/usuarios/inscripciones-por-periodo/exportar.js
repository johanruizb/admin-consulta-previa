import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Handler para la ruta API de Next.js que exporta inscripciones por período a Excel.
 *
 * @param {NextApiRequest} req - El objeto de solicitud HTTP.
 * @param {NextApiResponse} res - El objeto de respuesta HTTP.
 *
 * @returns {Promise<void>} - Una promesa que se resuelve cuando la operación se completa.
 **/
export default async function handler(req, res) {
    const { getToken } = getAuth(req);
    const token = await getToken();

    try {
        // Construir la URL con query parameters
        const queryParams = new URLSearchParams(req.query).toString();
        const url =
            process.env.NEXT_PUBLIC_BASE_URL +
            "/api/usuarios/inscripciones-por-periodo/exportar" +
            (queryParams ? `?${queryParams}` : "");

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            res.status(response.status).send({
                status: response.status,
                statusText: response.statusText,
            });
        } else {
            const contentType = response.headers.get("content-type");
            const content = Buffer.from(await response.arrayBuffer());

            res.setHeader("Content-Type", contentType);
            res.setHeader(
                "Content-Disposition",
                response.headers.get("content-disposition"),
            );
            res.status(response.status).send(content);
        }
    } catch (e) {
        res.status(500).json({ status: 500, statusText: e.message });
    }
}

export const config = {
    api: {
        responseLimit: false,
    },
    maxDuration: 60,
};
