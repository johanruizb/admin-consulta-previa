import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";

import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

import dayjs from "dayjs";
import "dayjs/locale/es";

import { formatNumber } from "@/components/utils";
import { Tooltip } from "@mui/joy";

dayjs.locale("es");

const COLORS = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
    "#a6cee3",
    "#1f78b4",
    "#b2df8a",
    "#33a02c",
    "#fb9a99",
    "#e31a1c",
    "#fdbf6f",
    "#ff7f00",
    "#cab2d6",
    "#6a3d9a",
    "#ffff99",
    "#b15928",
];

export default function CustomPie({ data = [], slotProps = {} }) {
    const {
        item: { root: itemRootProps = {}, stack: itemStackProps = {} } = {},
        pie: { root: pieRootProps = {} } = {},
    } = slotProps;

    return (
        <Stack
            flexDirection="row"
            flexWrap="wrap"
            flex={1}
            sx={{
                "& > *:first-of-type": {
                    "& > *:first-of-type": {
                        width: "200px !important",
                        flexGrow: "unset !important",
                        "& > *:first-of-type": {
                            "& > *:first-of-type": {
                                transform: "translateY(-50px) scale(1.5)",
                            },
                        },
                    },
                },
            }}
        >
            <Box
                {...pieRootProps}
                sx={{
                    width: { xs: "100%", md: "40%" },
                    // height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    ...pieRootProps.sx,
                }}
            >
                <PieChart
                    colors={COLORS}
                    series={[
                        {
                            data,
                            arcLabel: (item) => `${item.value}`,
                            arcLabelMinAngle: 35,
                            arcLabelRadius: "60%",
                            // paddingAngle: 5,
                            // innerRadius: 60,
                            // outerRadius: 80,
                        },
                    ]}
                    height={200}
                    width={250}
                    sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                            fontWeight: "bold",
                        },
                    }}
                    slotProps={{
                        legend: {
                            hidden: true,
                        },
                    }}
                />
            </Box>
            <Box
                sx={{
                    width: { xs: "100%", md: "60%" },
                }}
                flex={1}
            >
                <Grid
                    container
                    // flexDirection="row"
                    alignItems="center"
                    alignContent="center"
                    spacing={0.25}
                    sx={{
                        height: "100%",
                    }}
                >
                    {data?.map((item, index) => (
                        <Grid
                            size={6}
                            key={index}
                            sx={{
                                height: "fit-content !important",
                            }}
                            {...itemRootProps}
                        >
                            <Stack
                                direction="row"
                                alignItems="center"
                                // justifyContent="space-between"
                                spacing={1.25}
                                {...itemStackProps}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        minWidth: 20,
                                        minHeight: 20,
                                        // borderRadius: 10,
                                        backgroundColor: COLORS[index],
                                        mr: "5px !important",
                                    }}
                                />
                                <Tooltip
                                    title={`${item.label} (${formatNumber(
                                        item.value
                                    )})`}
                                    arrow
                                >
                                    <Typography
                                        level="body"
                                        noWrap
                                        sx={{
                                            ml: "0 !important",
                                        }}
                                    >
                                        {item.label} ({formatNumber(item.value)}
                                        )
                                    </Typography>
                                </Tooltip>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Stack>
    );
}
