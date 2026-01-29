/**
 * Componentes compound para gestión de encargados de grupos.
 *
 * Uso:
 * <Encargados.Provider cursoId={1}>
 *   <Encargados.Table grupos={grupos} />
 * </Encargados.Provider>
 *
 * O componentes individuales:
 * <Encargados.Badge grupoId={1} />
 * <Encargados.Selector value={usuario} onChange={setUsuario} />
 */

import { EncargadosProvider, useEncargadosContext } from "./EncargadosProvider";
import EncargadosTable from "./EncargadosTable";
import EncargadoSelector from "./EncargadoSelector";
import EncargadoBadge, { EncargadoBadgeInline } from "./EncargadoBadge";

const Encargados = {
    Provider: EncargadosProvider,
    Table: EncargadosTable,
    Selector: EncargadoSelector,
    Badge: EncargadoBadge,
    BadgeInline: EncargadoBadgeInline,
    useContext: useEncargadosContext,
};

export {
    EncargadosProvider,
    useEncargadosContext,
    EncargadosTable,
    EncargadoSelector,
    EncargadoBadge,
    EncargadoBadgeInline,
};

export default Encargados;
