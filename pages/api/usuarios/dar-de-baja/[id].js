import { getAuth } from "@clerk/nextjs/server";

async function buffer(readable) {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

export default async function handler(req, res) {
    const { getToken } = getAuth(req);
    const token = await getToken();

    const id = parseInt(req.query.id);
    if (!id) {
        return res.status(400).json({ message: "ID inválido" });
    }

    if (req.method === "POST") {
        const formDataBuffer = await buffer(req);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/usuarios/inscritos/${id}/dar-de-baja`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": req.headers["content-type"],
                },
                body: formDataBuffer,
            },
        );

        const result = await response.json();
        res.status(response.status).json(result);
    } else {
        res.status(405).json({ message: "Método no permitido" });
    }
}

export const config = {
    api: {
        responseLimit: false,
        bodyParser: false,
    },
};
