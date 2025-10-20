import InitColorSchemeScript from "@mui/joy/InitColorSchemeScript";
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="es">
                <Head>
                    <script
                        defer
                        src="https://analytics.consultaprevia.net/script.js"
                        data-website-id="016e56b0-23da-4331-8937-a9c4d0a50d0f"
                    ></script>
                </Head>
                <body>
                    <InitColorSchemeScript defaultMode="light" />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
