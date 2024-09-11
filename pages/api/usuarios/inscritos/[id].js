import { getIronSession } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Handler para la ruta API de Next.js que maneja la obtención la información de un inscrito.
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

    const id = parseInt(req.query.id);
    if (!id) {
        res.status(200).end();
        return;
    }

    if (req.method === "POST") {
        const response = await fetch(
            process.env.NEXT_PUBLIC_BASE_URL + "/api/usuarios/inscritos/" + id,
            {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + session.accessToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(req.body),
            }
        );
        const result = await response.json();
        res.status(response.status).json(result);
    } else if (req.method === "GET") {
        const response = await fetch(
            process.env.NEXT_PUBLIC_BASE_URL + "/api/usuarios/inscritos/" + id,
            {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + session.accessToken,
                },
            }
        );
        const result = await response.json();
        res.status(response.status).json(result);
    }
}

export const config = {
    api: {
        responseLimit: false,
    },
};
