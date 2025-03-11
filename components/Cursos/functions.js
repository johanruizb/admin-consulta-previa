import Fuse from "fuse.js";

import { chunk } from "lodash";

import { cloneDeep } from "lodash";

function filter(
    originalData,
    state,
    callback,
    keys = [
        "pais_nac",
        "departamento_res",
        "genero",
        "etnia",
        "tipo_cliente",
        "zona",
        "conectividad",
    ],
) {
    const { search, ...rest } = state;

    const entries = Object.entries(rest);
    let result = cloneDeep(originalData);

    if (rest !== undefined)
        result = originalData.filter((row) => {
            return entries.every(([key, value]) => {
                // TODO: Verificar si esto es correcto
                if (
                    (value !== 0 && value !== false && !value) ||
                    row[key] === undefined ||
                    value?.toString().trim() === "" ||
                    value === "all"
                )
                    return true;

                return String(row[key]) === String(value);
            });
        });

    if (search !== undefined) {
        const fuse = new Fuse(result, {
            keys,
            useExtendedSearch: true,
            // threshold: 0.3,
        });
        result = fuse.search("'" + state.search).map((item) => item.item);
    }

    const chunkedList = chunk(result, 50);

    callback((prev) => ({
        ...prev,
        chunked: chunkedList,
        pages: chunkedList.length,
    }));
}

export { filter };
