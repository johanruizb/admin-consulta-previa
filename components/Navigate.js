import { useRouter } from "next/router";
import { useEffect } from "react";

function Navigate({ to, options, replace }) {
    const router = useRouter();

    useEffect(() => {
        if (replace) {
            router.replace(to, undefined, options);
        } else {
            router.push(to, undefined, options);
        }
    }, [to, options]);

    return null;
}

export default Navigate;
