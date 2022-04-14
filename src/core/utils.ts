export function toCamelCase(data: string) {

    return String(data).replace(/[^a-zA-Z ]/g, ' ').replace(/\b(\w)/g, function (match: any, capture: any) {
        return capture.toUpperCase();
    }).replace(/\s+/g, '')
}