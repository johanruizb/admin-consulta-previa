// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from "next/server";
// import { ServerResponse } from "http";

/**
 * Handler para la ruta API de Next.js que maneja el inicio de sesión.
 *
 * @param {NextRequest} req - El objeto de solicitud HTTP.
 * @param {NextResponse} res - El objeto de respuesta HTTP.
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
export default function handler(req, res) {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

    const { username, password } = req.body;
    fetch(baseURL + "/api/autenticacion/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    }).then(async (response) => {
        if (response.ok) {
            const { access } = await response.json();

            res.setHeader(
                "Set-Cookie",
                `session=${access}; Path=/; HttpOnly; SameSite=Strict`
            );
            return res
                .status(200)
                .json({ message: "Inicio de sesión exitoso" });
        } else {
            return res
                .status(401)
                .json({ message: "Error en el inicio de sesión" });
        }
    });
}
