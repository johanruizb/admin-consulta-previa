import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Handler para la ruta API de Next.js que maneja la obtención de los inscritos.
 *
 * @param {NextApiRequest} req - El objeto de solicitud HTTP.
 * @param {NextApiResponse} res - El objeto de respuesta HTTP.
 *
 * @returns {Promise<void>} - Una promesa que se resuelve cuando la operación de inicio de sesión se completa.
 **/
export default async function handler(req, res) {
    const { getToken } = getAuth(req);
    const token = await getToken();

    // Construir la URL con query parameters
    const queryParams = new URLSearchParams(req.query).toString();
    const url =
        process.env.NEXT_PUBLIC_BASE_URL +
        "/api/usuarios/inscritos" +
        (queryParams ? `?${queryParams}` : "");

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.ok) {
        const inscritos = await response.json();

        res.status(200).json(inscritos);
    } else {
        res.status(401).end();
    }
}

export const config = {
    api: {
        responseLimit: false,
    },
};
