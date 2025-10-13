/**
 * Converts an object of arguments into a URL-encoded query string.
 * Handles both single values and arrays, appending array values multiple times with the same key.
 *
 * @param {Object} args - An object containing key-value pairs to be converted into URL parameters
 * @param {*} args[].* - Values can be strings, numbers, arrays, or other types that can be converted to strings
 * @returns {string} A URL-encoded query string (without the leading '?')
 *
 * @example
 * getParams({ name: 'John', age: 30 })
 * // returns "name=John&age=30"
 *
 * @example
 * getParams({ id: [1, 2, 3], filter: 'active' })
 * // returns "id=1&id=2&id=3&filter=active"
 */
const getParams = (args) => {
    const params = new URLSearchParams();

    Object.entries(args).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
        } else {
            params.append(key, value);
        }
    });

    return params.toString();
};

export default getParams;
