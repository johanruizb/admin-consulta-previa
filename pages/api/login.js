// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getSeconds } from "@/components/utils";
import { getIronSession } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";

// import { ServerResponse } from "http";

/**
 * Handler para la ruta API de Next.js que maneja el inicio de sesión.
 *
 * @param {NextApiRequest} req - El objeto de solicitud HTTP.
 * @param {NextApiResponse} res - El objeto de respuesta HTTP.
 *
 * @returns {Promise<void>} - Una promesa que se resuelve cuando la operación de inicio de sesión se completa.
 *
 * Ejemplo de uso en una solicitud HTTP POST
 * @example
 * fetch('/api/login', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json'
 *   },
 *   body: JSON.stringify({ username: 'usuario', password: 'contraseña' })
 * }).then(response => {
 *   if (response.ok) {
 *     console.log('Inicio de sesión exitoso');
 *   } else {
 *     console.error('Error en el inicio de sesión');
 *   }
 * });
 */
export default async function handler(req, res) {
    const { username, password } = req.body;
    const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/autenticacion/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        }
    );
    if (response.ok) {
        const session = await getIronSession(req, res, {
            password: process.env.SESSION_SECRET,
            cookieName: "session",
            cookieOptions: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: getSeconds("7d") - 60,
            },
        });

        const { access, refresh, ...data } = await response.json();

        // Informacion de la sesion
        session.accessToken = access;
        session.refreshToken = refresh;

        // Informacion del usuario
        session.fullname = data.full_name;
        session.username = data.username;
        session.role = data.role;

        await session.save();

        res.status(200).end();
    } else {
        res.status(401).end();
    }
}
