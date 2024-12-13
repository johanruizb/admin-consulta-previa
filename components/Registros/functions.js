import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import BookIcon from "@mui/icons-material/Book";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

function getIconHistory(history_type, props = {}) {
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
