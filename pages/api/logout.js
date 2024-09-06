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
export default async function handler(req, res) {
    // Eliminar la cookie de sesión
    res.setHeader(
        "Set-Cookie",
        `session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
    );

    res.status(200).json({ message: "Sesión cerrada" });
}
