import { SignedIn, SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Skeleton from "@mui/joy/Skeleton";
import Typography from "@mui/joy/Typography";
import useSWR from "swr";
import fetcher from "../fetcher";
import { getURL } from "../utils";

export default function Profile() {
    const { data: djangoUser } = useSWR(getURL("api/user"), fetcher);
    const { isLoaded, isSignedIn, user } = useUser();
    const isLoading = !isLoaded || !isSignedIn;

    return (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {/* <Avatar variant="outlined" size="sm" /> */}
            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Skeleton
                    loading={isLoading}
                    width="100%"
                    sx={{
                        display: "inline-block",
                        height: "9px",
                    }}
                >
                    <Stack direction="column" spacing={0}>
                        <Typography component="div" level="title-sm">
                            {user?.fullName}
                        </Typography>
                        <Typography component="div" level="body-xs" noWrap>
                            {djangoUser
                                ? `${djangoUser.role} — ${djangoUser.username}`
                                : ""}
                        </Typography>
                    </Stack>
                </Skeleton>
                <Typography level="body-xs">
                    <Skeleton
                        loading={isLoading}
                        width="100%"
                        sx={{
                            display: "inline-block",
                            height: "9px",
                        }}
                    >
                        {user?.role}
                    </Skeleton>
                </Typography>
            </Box>
            <SignOutButton key="logout-button">
                <IconButton size="sm" variant="plain" color="neutral">
                    <LogoutRoundedIcon />
                </IconButton>
            </SignOutButton>
        </Box>
    );
}
