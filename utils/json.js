function jsonFilter(jsonobj, filter = []) {
    const entries = Object.entries(jsonobj);
    const newJson = Object.fromEntries(
        entries.filter(([key]) => !filter.includes(key)),
    );

    return newJson;
}

export { jsonFilter };
