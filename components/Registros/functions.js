import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import BookIcon from "@mui/icons-material/Book";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

function getIconHistory(history_type) {
    switch (history_type) {
        case "Registrado":
            return <PersonAddIcon />;
        case "Modificado":
            return <EditIcon />;
        case "Verificado":
            return <ChecklistRtlIcon />;
        default:
            return <BookIcon />;
    }
}

export { getIconHistory };
