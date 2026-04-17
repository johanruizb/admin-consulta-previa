import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
    if (req.method !== "GET" && req.method !== "PATCH") {
        res.setHeader("Allow", "GET, PATCH");
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { getToken } = getAuth(req);
    const token = await getToken();
    const { curso_id } = req.query;

    const url =
        process.env.NEXT_PUBLIC_BASE_URL +
        `/api/v1/moodle/curso/${curso_id}/umbral-certificado`;

    try {
        const fetchOptions = {
            method: req.method,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };

        if (req.method === "PATCH") {
            fetchOptions.body = JSON.stringify(req.body);
        }

        const response = await fetch(url, fetchOptions);

        let result;
        try {
            result = await response.json();
        } catch {
            result = { statusText: response.statusText, error: true };
        }

        res.status(response.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
