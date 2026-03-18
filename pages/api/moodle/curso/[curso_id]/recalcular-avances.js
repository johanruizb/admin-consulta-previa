import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { getToken } = getAuth(req);
    const token = await getToken();
    const { curso_id } = req.query;

    const url =
        process.env.NEXT_PUBLIC_BASE_URL +
        `/api/v1/moodle/curso/${curso_id}/recalcular-avances`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });

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
