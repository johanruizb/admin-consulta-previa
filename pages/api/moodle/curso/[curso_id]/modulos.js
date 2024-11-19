import { getIronSession } from "iron-session";

export default async function handler(req, res) {
    const session = await getIronSession(req, res, {
        password: process.env.SESSION_SECRET,
        cookieName: "session",
    });

    const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL +
            "/api/v1/moodle/curso/" +
            req.query.curso_id +
            "/modulos",
        {
            method: "GET",
            headers: {
                Authorization: "Bearer " + session.accessToken,
                "X-Referer": req.headers.referer,
            },
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
