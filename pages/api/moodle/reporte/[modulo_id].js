import { getIronSession } from "iron-session";
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
    const session = await getIronSession(req, res, {
        password: process.env.SESSION_SECRET,
        cookieName: "session",
    });

    const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL +
            "/api/v1/moodle/reporte/" +
            req.query.modulo_id,
        {
            method: "GET",
            headers: {
                Authorization: "Bearer " + session.accessToken,
            },
        }
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

export const config = {
    api: {
        responseLimit: false,
        bodyParser: false,
    },
};
