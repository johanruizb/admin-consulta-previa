import { Box } from "@mui/joy";
import { useEffect, useRef, useState } from "react";
import { useSchema } from "../Home/ColorSchemeToggle";

const EmbedMonitor = ({
    monitor,
    // theme = "light",
    bgc = "transparent",
    locale = "es",
}) => {
    const { mode } = useSchema();

    const containerRef = useRef(null);
    const iframeRef = useRef(null);
    const [uid] = useState(
        `embed-container-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 5)}`
    );

    useEffect(() => {
        if (!monitor || !containerRef.current) return;

        const container = containerRef.current;

        // Remove previous iframe if exists
        if (iframeRef.current) {
            iframeRef.current.remove();
        }

        // Create a new iframe
        const iframe = document.createElement("iframe");
        iframe.src = `${monitor}?theme=${mode}&bgc=${bgc}&locale=${locale}`;
        iframe.width = "0%";
        iframe.height = "0";
        iframe.frameBorder = "0";
        iframe.allowTransparency = true;
        iframe.sandbox =
            "allow-modals allow-forms allow-same-origin allow-scripts allow-popups allow-top-navigation-by-user-activation allow-downloads";
        iframe.allow =
            "midi; geolocation; microphone; camera; display-capture; encrypted-media;";

        container.appendChild(iframe);
        iframeRef.current = iframe;

        const setHeight = (data) => {
            if (data.height !== undefined) {
                iframe.height = data.height;
            }
        };

        const setWidth = (data) => {
            if (data.width !== undefined) {
                iframe.width = data.width;
            }
        };

        const messageListener = (event) => {
            if (event.data && event.data.height !== undefined) {
                setHeight(event.data);
            }
            if (event.data && event.data.width !== undefined) {
                setWidth(event.data);
            }
        };

        window.addEventListener("message", messageListener);

        return () => {
            window.removeEventListener("message", messageListener);
            if (iframe) {
                iframe.remove();
            }
        };
    }, [monitor, bgc, locale, mode]);

    return (
        <Box
            sx={{
                body: {
                    bgcolor: "transparent !important",
                },
            }}
        >
            <div id={uid} ref={containerRef} />
        </Box>
    );
};

export default EmbedMonitor;
