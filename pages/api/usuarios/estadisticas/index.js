import { getIronSession } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Handler para la ruta API de Next.js que maneja la obtención de las estadísticas.
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
        process.env.NEXT_PUBLIC_BASE_URL + "/api/usuarios/estadisticas",
        {
            method: "POST",
            headers: {
                Authorization: "Bearer " + session.accessToken,
                "Content-Type": "application/json",
            },
            body: req.body,
        },
    );

    if (response.ok) {
        const estadisticas = await response.json();

        res.status(200).json(estadisticas);
    } else {
        res.status(401).end();
    }
}
