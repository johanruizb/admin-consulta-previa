// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextRequest } from "next/server";
import { ServerResponse } from "http";
/**
 * Handler para la ruta API de Next.js que maneja el inicio de sesión.
 *
 * @param {NextRequest} req - El objeto de solicitud HTTP.
 * @param {ServerResponse} res - El objeto de respuesta HTTP.
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
    const data = await fetch("http://localhost:8080/api/autenticacion/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (data.ok) {
        const { access } = await data.json();

        res.setHeader(
            "Set-Cookie",
            `session=${access}; Path=/; HttpOnly; SameSite=Strict`
        );
        res.statusCode = 200;
    } else {
        res.statusCode = 401;
    }

    res.end();
}
