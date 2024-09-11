export function openSidebar() {
    if (typeof window !== "undefined") {
        document.body.style.overflow = "hidden";
        document.documentElement.style.setProperty(
            "--SideNavigation-slideIn",
            "1"
        );
    }
}

export function closeSidebar() {
    if (typeof window !== "undefined") {
        document.documentElement.style.removeProperty(
            "--SideNavigation-slideIn"
        );
        document.body.style.removeProperty("overflow");
    }
}

export function toggleSidebar() {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
        const slideIn = window
            .getComputedStyle(document.documentElement)
            .getPropertyValue("--SideNavigation-slideIn");
        if (slideIn) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }
}

/**
 * Obtiene el número y la unidad de tiempo de una cadena dada.
 *
 * @param {string} until - La cadena que contiene el número y la unidad de tiempo.
 * @returns {Object} El número de segundos desde "now" y el tiempo "until" en el futuro.
 */
export function getSeconds(until) {
    const unit = until.charAt(until.length - 1);
    const number = parseFloat(until);

    const conversion = {
        s: 1,
        m: 60,
        h: 3600,
        d: 86400,
        M: 2592000,
    };

    if (conversion[unit] === undefined) return 0;

    const result = number * conversion[unit];
    return result;
}

export function formatNumber(number, locale = "en-US", options = {}) {
    const result = new Intl.NumberFormat(locale, options).format(number);
    return result.replace(",", ".");
}

function getWindow() {
    if (typeof window !== "undefined") return window;
    return null;
}

function joinURL(base, path) {
    const {
        location: { hostname },
    } = getWindow() ?? { location: {} };

    // Asegurarte de que el path no empiece con "/"
    if (path.startsWith("/")) path = path.slice(1);

    // Crear la URL completa
    let fullUrl = `${base.replace(/\/$/, "")}/${path}`;

    // Si es producción, reemplazar el esquema con "https"
    if (hostname !== "localhost")
        fullUrl = fullUrl.replace(/^http:\/\//, "https://");

    return fullUrl;
}

export function getURL(url = "") {
    const result = joinURL(process.env.NEXT_PUBLIC_ORIGIN_URL, url);
    // console.log(result);
    return result;
}

export const format = (template, values) => {
    return template.replace(/\$(\d+)/g, (match, index) => values[index - 1]);
};
