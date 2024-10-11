const replaceAllSpaces = (e, { onBlur, onChange }) => {
    e.target.value = e.target.value?.replaceAll(" ", "") ?? "";
    onBlur?.(e);
    onChange?.(e);
};

const trimSpaces = (e, { onBlur, onChange }) => {
    e.target.value = e.target.value?.trim() ?? "";
    onBlur?.(e);
    onChange?.(e);
};

const toUpperCase = (e, { onBlur, onChange }) => {
    e.target.value = e.target.value?.toUpperCase() ?? "";
    onBlur?.(e);
    onChange?.(e);
};

export { replaceAllSpaces, trimSpaces, toUpperCase };
