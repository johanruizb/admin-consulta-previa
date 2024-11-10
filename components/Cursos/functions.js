import Fuse from "fuse.js";

import { chunk } from "lodash";

import { cloneDeep } from "lodash";

function filter(originalData, state, callback) {
    const { search, ...rest } = state;

    const entries = Object.entries(rest);
    let result = cloneDeep(originalData);

    result = originalData.filter((row) => {
        return entries.every(([key, value]) => {
            // TODO: Verificar si esto es correcto
            if (row[key] === undefined) return true;

            return String(row[key]) === String(value);
        });
    });

    if (search !== undefined) {
        const fuse = new Fuse(result, {
            keys: [
                "pais_nac",
                "departamento_res",
                "genero",
                "etnia",
                "tipo_cliente",
                "zona",
                "conectividad",
            ],
            useExtendedSearch: true,
            // threshold: 0.3,
        });
        result = fuse.search("'" + state.search).map((item) => item.item);
    }

    const chunkedList = chunk(result, 50);

    callback((prev) => ({
        ...prev,
        // filtered: result,
        chunked: chunkedList,
        pages: chunkedList.length,
    }));
}

export { filter };
