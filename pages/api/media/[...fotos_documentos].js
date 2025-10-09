import { getIronSession } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Handler para la ruta API de Next.js que recupera un archivo multimedia.
 *
 * Soporta dos tipos de rutas:
 * 1. Ruta legacy: /api/media/fotos/archivo.jpg → /media/fotos/archivo.jpg (Django)
 * 2. Ruta nueva (ServeImageView): /api/media/persona/{id}/imagen/{campo}
 *    → api/usuarios/persona/{id}/imagen/{campo}/ (Django)
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

    // Verificar que haya una sesión activa con accessToken
    if (!session.accessToken) {
        return res.status(401).json({ error: "No autenticado" });
    }

    const pathSegments = req.query.fotos_documentos;
    let backendURL;

    // Detectar si es la nueva ruta de ServeImageView
    // Patrón: persona/{id}/imagen/{campo}
    if (
        pathSegments.length === 4 &&
        pathSegments[0] === "persona" &&
        pathSegments[2] === "imagen" &&
        (pathSegments[3] === "foto_doc1" || pathSegments[3] === "foto_doc2")
    ) {
        // Nueva ruta: construir URL para ServeImageView
        const personaId = pathSegments[1];
        const campo = pathSegments[3];
        backendURL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/usuarios/persona/${personaId}/imagen/${campo}/`;
    } else {
        // Ruta legacy: mantener comportamiento anterior
        const URL = pathSegments.join("/");
        backendURL = `${process.env.NEXT_PUBLIC_BASE_URL}/media/${URL}`;
    }

    try {
        const response = await fetch(backendURL, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + session.accessToken,
            },
        });

        if (!response.ok) {
            // Si es un error del backend, intentar obtener el mensaje de error
            try {
                const errorData = await response.json();
                return res.status(response.status).json(errorData);
            } catch {
                // Si no hay JSON, retornar status sin body
                return res.status(response.status).end();
            }
        }

        const contentType = response.headers.get("content-type");
        const content = Buffer.from(await response.arrayBuffer());

        // Propagar headers de cache desde el backend
        const cacheControl = response.headers.get("cache-control");
        if (cacheControl) {
            res.setHeader("Cache-Control", cacheControl);
        }

        res.setHeader("Content-Type", contentType);
        res.status(response.status).send(content);
    } catch (e) {
        console.error("Error en proxy de medios:", e);
        res.status(500).json({ error: e.message });
    }
}

export const config = {
    api: {
        responseLimit: false,
    },
};
