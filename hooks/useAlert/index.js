import { useSnackbar } from "notistack";

export default function useAlert() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const onClose = () => {
        closeSnackbar();
    };

    const onOpen = (content, color) => {
        const variant = color === "danger" ? "error" : color || "success";
        enqueueSnackbar(content, { variant });
    };

    return { onClose, onOpen };
}
