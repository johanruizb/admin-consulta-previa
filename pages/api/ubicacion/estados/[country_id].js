import { NextApiRequest, NextApiResponse } from "next";

/**
 * Handler para la ruta API de Next.js que maneja la obtención de los estados de un país.
 *
 * @param {NextApiRequest} req - El objeto de solicitud HTTP.
 * @param {NextApiResponse} res - El objeto de respuesta HTTP.
 *
 * @returns {Promise<void>} - Una promesa que se resuelve cuando la operación de inicio de sesión se completa.
 **/
export default async function handler(req, res) {
    const country_id = parseInt(req.query.country_id);

    if (isNaN(country_id)) res.status(200).end();
    else {
        const response = await fetch(
            process.env.NEXT_PUBLIC_BASE_URL +
                "/api/ubicacion/estados/" +
                country_id,
            {
                method: "GET",
                headers: {
                    // get client path
                    "X-Referer": req.headers.referer,
                },
            },
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
