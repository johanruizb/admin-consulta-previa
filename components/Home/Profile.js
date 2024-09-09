import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";

import { useRouter } from "next/router";

import { useState } from "react";

import Skeleton from "@mui/joy/Skeleton";
import useSWR from "swr";

import fetcher from "@/components/fetcher";
import { getURL } from "../utils";

export default function Profile() {
    const { data, error, isLoading } = useSWR(getURL("api/user"), fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const [logout, setLogout] = useState(false);
    const router = useRouter();

    const onLogout = () => {
        setLogout(true);

        fetch("/api/logout", {
            method: "POST",
        })
            .then(() => {
                router.reload();
            })
            .finally(() => {
                setLogout(false);
            });
    };

    return (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {/* <Avatar variant="outlined" size="sm" /> */}
            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography level="title-sm">
                    <Skeleton
                        loading={isLoading}
                        width="100%"
                        sx={{
                            display: "inline-block",
                            height: "9px",
                        }}
                    >
                        {data?.fullname ?? data?.username}
                    </Skeleton>
                </Typography>
                <Typography level="body-xs">
                    <Skeleton
                        loading={isLoading}
                        width="100%"
                        sx={{
                            display: "inline-block",
                            height: "9px",
                        }}
                    >
                        {data?.role}
                    </Skeleton>
                </Typography>
            </Box>
            <IconButton
                size="sm"
                variant="plain"
                color="neutral"
                onClick={onLogout}
                loading={logout}
            >
                <LogoutRoundedIcon />
            </IconButton>
        </Box>
    );
}
