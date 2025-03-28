import Alert from "@mui/joy/Alert";
import IconButton from "@mui/joy/IconButton";

import Close from "@mui/icons-material/Close";

import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";

export default function CustomAlert({ autoHideDuration = 6000 }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted ? <Custom autoHideDuration={autoHideDuration} /> : null;
}

function Custom({ autoHideDuration = 6000 }) {
    const [config, saveConfig] = useLocalStorage("CustomAlert", {
        open: false,
        variant: "solid",
        color: "success",
        content: "",
    });

    const interval = useRef(null);

    const onClose = () => {
        saveConfig({
            open: false,
            variant: "solid",
            color: "success",
            content: "",
        });
    };

    useEffect(() => {
        if (config.open) {
            interval.current = setTimeout(() => {
                onClose();
            }, autoHideDuration);
        }

        return () => {
            clearInterval(interval.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config.open]);

    return (
        config.open && (
            <Alert
                size="lg"
                variant={config.variant}
                color={config.color}
                sx={{
                    position: "absolute",
                    // top: 0,
                    // left: 0,
                    right: "10px",
                    bottom: "10px",
                    zIndex: 9999,
                }}
                endDecorator={
                    <IconButton
                        onClick={onClose}
                        variant="plain"
                        sx={{
                            "--IconButton-size": "32px",
                            transform: "translate(0.5rem, -0.5rem)",
                        }}
                    >
                        <Close />
                    </IconButton>
                }
            >
                {config.content}
            </Alert>
        )
    );
}
