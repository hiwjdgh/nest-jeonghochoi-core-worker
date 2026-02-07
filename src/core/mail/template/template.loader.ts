import fs from 'fs/promises';
import path from 'path';

export async function loadTemplate(baseDir: string, name: string) {
    const file = path.join(baseDir, `${name}.hbs`);
    return fs.readFile(file, 'utf-8');
}
