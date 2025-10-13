import { getAuth } from "@clerk/nextjs/server";
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
    const { getToken } = getAuth(req);
    const token = await getToken();

    const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/autenticacion/permisos",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (response.ok) {
        const permisos = await response.json();
        res.status(200).json(permisos);
    } else {
        res.status(response.status).json(response.statusText);
    }
}
