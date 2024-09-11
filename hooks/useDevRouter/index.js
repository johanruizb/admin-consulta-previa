import { useRouter } from "next/navigation";
import { useEffect } from "react";

function useDevRouter() {
    const router = useRouter();

    useEffect(() => {
        if (process.env.NODE_ENV === "production") router.push("/registros");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}

export default useDevRouter;
