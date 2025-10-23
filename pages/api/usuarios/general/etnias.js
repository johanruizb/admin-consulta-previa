import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
    const { getToken } = getAuth(req);
    const token = await getToken();

    const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/usuarios/etnias",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "X-Referer": req.headers.referer,
            },
        },
    );
    const result = await response.json();
    res.status(response.status).json(result);
}

export const config = {
    api: {
        responseLimit: false,
        bodyParser: false,
    },
};
