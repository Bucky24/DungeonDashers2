export function processTemplate(template, data) {
    for (const key in data) {
        template = template.replace(`{${key}}`, data[key]);
    }

    return template;
}