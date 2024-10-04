export default async function fetcher(...args) {
    const res = await fetch(...args);
    return res.ok
        ? res.json()
        : Promise.reject({ status: res.status, statusText: res.statusText });
}
