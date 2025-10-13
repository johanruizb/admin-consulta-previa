/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compiler: {
        // Enables the styled-components SWC transform
        styledComponents: true,
    },
    transpilePackages: [
        "@mui/x-data-grid",
        "@mui/x-charts",
        "@mui/material",
        "@mui/joy",
        "@mui/icons-material",
    ],
};

export default nextConfig;
