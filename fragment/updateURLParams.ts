const updateURLParams = (params: Record<string, string | number | undefined>, reload = true) => {
    const url = new URL(window.location.href);

    for (const [key, value] of Object.entries(params)) {
        if (value === undefined) {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, String(value));
        }
    }

    if (reload) {
        window.location.href = url.toString();
    } else {
        history.replaceState(null, "", url.toString());
    }
};

export default updateURLParams;
