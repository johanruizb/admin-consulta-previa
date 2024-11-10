import { useIsClient, usePrevious, useRenderCount } from "@uidotdev/usehooks";
import { useEffect } from "react";

function useClient(doSomething = () => {}) {
    const render = useRenderCount();
    const isClient = useIsClient();
    const previousClient = usePrevious(isClient);

    useEffect(() => {
        if (isClient && previousClient === false) {
            doSomething();
        }
    }, [isClient, previousClient]);
}

export default useClient;
