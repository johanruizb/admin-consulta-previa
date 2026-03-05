import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import LinearProgress from "@mui/joy/LinearProgress";
import Skeleton from "@mui/joy/Skeleton";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

export function ResumenGeneralSkeleton() {
    return (
        <Card
            sx={{
                minHeight: "280px",
                bgcolor: "transparent !important",
                borderColor: "transparent !important",
                pb: "0px !important",
            }}
        >
            <CardContent>
                <Skeleton variant="text" level="title-lg" width="60%" sx={{ mb: 1 }} />
                <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mb: 1.5 }}>
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} variant="rectangular" width={100} height={20} sx={{ borderRadius: "sm" }} />
                    ))}
                </Stack>
                <Stack spacing={1} direction="row" sx={{ mb: 0.5 }}>
                    {[1, 2].map((i) => (
                        <Card key={i} sx={{ flex: 1 }}>
                            <CardContent>
                                <Skeleton variant="text" level="body-sm" width="70%" />
                                <Skeleton variant="text" level="h2" width="50%" />
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
                <Stack spacing={1} direction="row">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} sx={{ flex: 1 }}>
                            <CardContent>
                                <Skeleton variant="text" level="body-sm" width="70%" />
                                <Skeleton variant="text" level="h2" width="40%" />
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
}

export function DistribucionSkeleton() {
    return (
        <Card sx={{ minHeight: "280px", height: "100%" }}>
            <CardContent>
                <Skeleton variant="text" level="title-lg" width="60%" sx={{ mb: 2 }} />
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={3} sx={{ height: 200 }}>
                    <Skeleton variant="circular" width={160} height={160} />
                    <Stack spacing={1}>
                        {[1, 2, 3, 4].map((i) => (
                            <Stack key={i} direction="row" spacing={1} alignItems="center">
                                <Skeleton variant="rectangular" width={12} height={12} />
                                <Skeleton variant="text" width={80} />
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}

export function ModulosSkeleton({ count = 2 }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <Grid key={i} size={{ xs: 6 }}>
                    <Card>
                        <CardContent>
                            <Skeleton variant="text" level="title-lg" width="50%" sx={{ mb: 2 }} />
                            <Stack spacing={1} direction="row" alignItems="flex-end" justifyContent="center" sx={{ height: 250 }}>
                                {[1, 2, 3, 4].map((j) => (
                                    <Skeleton
                                        key={j}
                                        variant="rectangular"
                                        width={40}
                                        height={80 + j * 30}
                                        sx={{ borderRadius: "4px 4px 0 0" }}
                                    />
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </>
    );
}

export function TablaMetaSkeleton() {
    return (
        <Card>
            <CardContent>
                <Stack spacing={1.5}>
                    <Skeleton variant="rectangular" height={36} sx={{ borderRadius: "sm" }} />
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} variant="rectangular" height={28} sx={{ borderRadius: "sm" }} />
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
}

export function AvanceGruposSkeleton() {
    return (
        <Grid container spacing={1} sx={{ pb: 2 }}>
            <Grid size={{ xs: 12 }}>
                <Card>
                    <CardContent>
                        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: "sm" }} />
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 12 }}>
                <Card>
                    <CardContent>
                        <Stack spacing={1.5}>
                            <Skeleton variant="rectangular" height={40} sx={{ borderRadius: "sm" }} />
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} variant="rectangular" height={32} sx={{ borderRadius: "sm" }} />
                            ))}
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

export function SectionLoader({ children, isRefetching, skeleton, showSkeleton }) {
    if (showSkeleton) return skeleton;

    return (
        <Box sx={{ position: "relative" }}>
            {isRefetching && (
                <LinearProgress
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1,
                        borderRadius: "sm",
                    }}
                />
            )}
            <Box
                sx={{
                    opacity: isRefetching ? 0.5 : 1,
                    pointerEvents: isRefetching ? "none" : "auto",
                    transition: "opacity 0.2s ease-in-out",
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
