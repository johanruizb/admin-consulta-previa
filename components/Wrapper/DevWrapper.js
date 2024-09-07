import { Fragment } from "react";

function DevWrapper({ children }) {
    if (process.env.NODE_ENV === "development") {
        return <Fragment>{children}</Fragment>;
    }
}

export default DevWrapper;
