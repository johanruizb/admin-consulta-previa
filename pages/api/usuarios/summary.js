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
    console.log("Query Params:", queryParams);
    const url =
        process.env.NEXT_PUBLIC_BASE_URL +
        "/api/usuarios/summary" +
        (queryParams ? `?${queryParams}` : "");

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json();
    res.status(response.status).json(result);
}

export const config = {
    api: {
        responseLimit: false,
    },
};
