import Handlebars from 'handlebars';

export function renderTemplate(source: string, data: Record<string, any>) {
    const tpl = Handlebars.compile(source);
    return tpl(data);
}
