import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import BookIcon from "@mui/icons-material/Book";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

function getIconHistory(history_type, props = {}) {
    // Registro de curso por cuenta propia (color verde)
    if (history_type.startsWith("Registrado al")) {
        return <PersonAddIcon {...props} fontSize="medium" color="success" />;
    }

    // Modificación de registro (color info/azul)
    if (history_type.startsWith("Modificado registro del")) {
        return <EditIcon {...props} fontSize="medium" color="info" />;
    }

    // Eliminación de curso (color error/rojo)
    if (history_type.startsWith("Eliminado del")) {
        return <PersonAddIcon {...props} fontSize="medium" color="error" />;
    }

    switch (history_type) {
        case "Registrado":
            return <PersonAddIcon {...props} fontSize="medium" />;
        case "Modificado":
            return <EditIcon {...props} fontSize="medium" />;
        case "Verificado":
            return <ChecklistRtlIcon {...props} fontSize="medium" />;
        default:
            return <BookIcon {...props} fontSize="medium" />;
    }
}

export { getIconHistory };
