import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import BookIcon from "@mui/icons-material/Book";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

function getIconHistory(history_type, props = {}) {
    switch (history_type) {
        case "Registrado":
            return <PersonAddIcon {...props} />;
        case "Modificado":
            return <EditIcon {...props} />;
        case "Verificado":
            return <ChecklistRtlIcon {...props} />;
        default:
            return <BookIcon {...props} />;
    }
}

export { getIconHistory };
