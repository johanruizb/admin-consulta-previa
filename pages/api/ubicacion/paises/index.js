import { NextApiRequest, NextApiResponse } from "next";

/**
 * Handler para la ruta API de Next.js que maneja la obtención de los países.
 *
 * @param {NextApiRequest} req - El objeto de solicitud HTTP.
 * @param {NextApiResponse} res - El objeto de respuesta HTTP.
 *
 * @returns {Promise<void>} - Una promesa que se resuelve cuando la operación de inicio de sesión se completa.
 **/
export default async function handler(req, res) {
    const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/ubicacion/paises",
        {
            method: "GET",
        }
    );

    const result = await response.json();
    res.status(response.status).json(result);
}

export const config = {
    api: {
        responseLimit: false,
    },
};
