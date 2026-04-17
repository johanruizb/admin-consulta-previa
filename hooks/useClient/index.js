import { useIsClient, usePrevious } from "@uidotdev/usehooks";
import { useEffect, useRef } from "react";

function useClient(doSomething = () => {}) {
    const isClient = useIsClient();
    const previousClient = usePrevious(isClient);

    const callbackRef = useRef(doSomething);

    useEffect(() => {
        callbackRef.current = doSomething;
    }, [doSomething]);

    useEffect(() => {
        if (isClient && previousClient === false) {
            callbackRef.current();
        }
    }, [isClient, previousClient]);
}

export default useClient;
