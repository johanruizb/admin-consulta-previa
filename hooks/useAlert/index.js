import { useLocalStorage } from "@uidotdev/usehooks";
// import { v4 as uuidv4 } from "uuid";

export default function useAlert() {
    const [alert, setAlert] = useLocalStorage("CustomAlert", {
        open: false,
        variant: "solid",
        color: "success",
        content: "",
    });

    const onClose = () => {
        setAlert({ ...alert, open: false });
    };

    const onOpen = (content, color) => {
        onClose();
        setTimeout(() => {
            setAlert({ open: true, content, color });
        }, 100);
    };

    return { alert, onClose, onOpen };
}
