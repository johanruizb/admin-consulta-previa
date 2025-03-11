import { NextApiRequest, NextApiResponse } from "next";

/**
 * Handler para la ruta API de Next.js que maneja la obtención de las ciudades de un estado.
 *
 * @param {NextApiRequest} req - El objeto de solicitud HTTP.
 * @param {NextApiResponse} res - El objeto de respuesta HTTP.
 *
 * @returns {Promise<void>} - Una promesa que se resuelve cuando la operación de inicio de sesión se completa.
 **/
export default async function handler(req, res) {
    const state_id = parseInt(req.query.state_id);

    if (isNaN(state_id)) res.status(200).end();
    else {
        const response = await fetch(
            process.env.NEXT_PUBLIC_BASE_URL +
                "/api/ubicacion/ciudades/" +
                state_id,
            {
                method: "GET",
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
