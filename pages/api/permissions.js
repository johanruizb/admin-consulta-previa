import { getIronSession } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Handler para la ruta API de Next.js que maneja la obtención de los permisos.
 *
 * @param {NextApiRequest} req - El objeto de solicitud HTTP.
 * @param {NextApiResponse} res - El objeto de respuesta HTTP.
 *
 * @returns {Promise<void>} - Una promesa que se resuelve cuando la operación se completa.
 **/
export default async function handler(req, res) {
    const session = await getIronSession(req, res, {
        password: process.env.SESSION_SECRET,
        cookieName: "session",
    });

    if (!session.accessToken) return res.status(200).json([]);

    const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/autenticacion/permisos",
        {
            method: "GET",
            headers: {
                Authorization: "Bearer " + session.accessToken,
            },
        },
    );

    if (response.ok) {
        const permisos = await response.json();
        res.status(200).json(permisos);
    } else {
        res.status(response.status).json(response.statusText);
    }

    // res.status(401).end();
}
