import InitColorSchemeScript from "@mui/joy/InitColorSchemeScript";
import Document, { Head, Html, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="es">
                <Head></Head>
                <body>
                    <InitColorSchemeScript defaultMode="light" />
                    <Main />
                    <NextScript />
                    <script
                        defer
                        src="https://static.cloudflareinsights.com/beacon.min.js"
                        data-cf-beacon={`{ token: ${process.env.CLOUDFLARE_ANALYTICS} }`}
                    />
                </body>
            </Html>
        );
    }
}
