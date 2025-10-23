import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

async function buffer(readable) {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

/**
 * Handler para la ruta API de Next.js que maneja la obtención de los datos del usuario.
 *
 * @param {NextApiRequest} req - El objeto de solicitud HTTP.
 * @param {NextApiResponse} res - El objeto de respuesta HTTP.
 *
 * @returns {Promise<void>} - Una promesa que se resuelve cuando la operación de inicio de sesión se completa.
 **/
export default async function handler(req, res) {
    const { getToken } = getAuth(req);
    const token = await getToken();

    let response;

    if (req.method === "POST") {
        const formDataBuffer = await buffer(req);

        response = await fetch(
            process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/moodle/reporte",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data; boundary=----",
                },
                body: formDataBuffer,
            },
        );
    } else if (req.method === "GET") {
        response = await fetch(
            process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/moodle/reporte",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
    }

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

export const config = {
    api: {
        responseLimit: false,
        bodyParser: false,
    },
};
