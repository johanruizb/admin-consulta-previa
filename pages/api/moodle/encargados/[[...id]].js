import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
    const { getToken } = getAuth(req);
    const token = await getToken();

    const { id, ...queryParams } = req.query;
    const isDetail = id && id.length > 0;

    let url;
    if (isDetail) {
        const path = Array.isArray(id) ? id.join("/") : id;
        url = new URL(
            process.env.NEXT_PUBLIC_BASE_URL + `/api/v1/moodle/encargados/${path}/`
        );
    } else {
        url = new URL(
            process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/moodle/encargados/"
        );
    }

    Object.entries(queryParams).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
    });

    const fetchOptions = {
        method: req.method,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    if (req.method !== "GET" && req.method !== "DELETE" && req.body) {
        fetchOptions.body = JSON.stringify(req.body);
    }

    try {
        const response = await fetch(url.toString(), fetchOptions);
        const result = await response.json();
        res.status(response.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const config = {
    api: {
        responseLimit: false,
    },
};
