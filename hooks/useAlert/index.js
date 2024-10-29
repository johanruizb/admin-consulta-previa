import { useSessionStorage } from "@uidotdev/usehooks";

export default function useAlert() {
    const [alert, setAlert] = useSessionStorage("CustomAlert", {
        open: false,
        variant: "solid",
        color: "success",
        content: "",
    });

    const onClose = () => {
        setAlert({ ...alert, open: false });
    };

    const onOpen = (content, color) => {
        setAlert({ open: true, content, color });
    };

    return { alert, onClose, onOpen };
}
